import { NextRequest, NextResponse } from "next/server";
import { request, FormData } from "undici";
import { rateLimit, getRateLimitHeaders } from "../../utils/rateLimit";

const KOLOSAL_API_BASE = "https://api.kolosal.ai";

// Rate limit: 100 requests per day per IP
const MAX_REQUESTS = 100;
const WINDOW_MS = 86400000; // 24 hours (1 day)

function getKolosalApiKey(): string {
  const apiKey = process.env.KOLOSAL_API_KEY;
  
  if (!apiKey) {
    throw new Error("KOLOSAL_API_KEY environment variable is not set");
  }
  
  return `Bearer ${apiKey}`;
}

// Cloudinary config (optional fallback)
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

type OcrRequest = {
  image_data: string; // base64 image
  language?: string;
  auto_fix?: boolean;
  invoice?: boolean;
  custom_schema?: string;
  gcs_access_token?: string;
  gcs_url?: string;
};

// Helper function to safely parse JSON response
async function safeJsonParse(body: { text: () => Promise<string> }) {
  const text = await body.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text || "Unknown error" };
  }
}

// Convert base64 to Buffer
function base64ToBuffer(base64: string): { buffer: Buffer; mimeType: string } | null {
  if (!base64 || typeof base64 !== "string") {
    return null;
  }

  // Handle data URL format: data:image/png;base64,xxxxx
  let cleanBase64 = base64;
  let mimeType = "image/png";

  if (base64.includes(",")) {
    const parts = base64.split(",");
    if (parts.length < 2 || !parts[1]) {
      return null;
    }
    const header = parts[0];
    cleanBase64 = parts[1];

    // Extract mime type from header
    const mimeMatch = header.match(/data:([^;]+);/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }
  }

  if (!cleanBase64 || cleanBase64.trim().length === 0) {
    return null;
  }

  try {
    const buffer = Buffer.from(cleanBase64, "base64");
    if (!buffer || buffer.length === 0) {
      return null;
    }
    return { buffer, mimeType };
  } catch (error) {
    return null;
  }
}

// Upload image to Cloudinary and return URL (fallback if base64 fails)
async function uploadToCloudinary(base64: string): Promise<string | null> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return null;
  }

  try {
    const bufferData = base64ToBuffer(base64);
    if (!bufferData || !bufferData.buffer) {
      return null;
    }

    // Create form data for Cloudinary upload
    const formData = new FormData();
    formData.append("file", bufferData.buffer);
    formData.append("upload_preset", "ml_default"); // You may need to adjust this
    formData.append("folder", "ocr-temp");

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    const { statusCode, body } = await request(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    if (statusCode === 200) {
      const result = await safeJsonParse(body);
      if (result.secure_url) {
        return result.secure_url;
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  // Check rate limit
  const rateLimitResponse = rateLimit(req, MAX_REQUESTS, WINDOW_MS);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let apiKey: string;
  try {
    apiKey = getKolosalApiKey();
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "KOLOSAL_API_KEY environment variable is not set",
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  try {
    let response: NextResponse;
    if (action === "form") {
      response = await handleOcrForm(req, apiKey);
    } else {
      // Default to extract action
      response = await handleOcrExtract(req, apiKey);
    }

    // Add rate limit headers
    const headers = getRateLimitHeaders(req, MAX_REQUESTS, WINDOW_MS);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /ocr - Extract text from image using JSON body
async function handleOcrExtract(req: NextRequest, apiKey: string) {
  const {
    image_data,
    language = "auto",
    auto_fix = true,
    invoice = false,
    custom_schema,
    gcs_access_token,
    gcs_url,
  }: OcrRequest = await req.json();

  if (!image_data && !gcs_url) {
    return NextResponse.json({ error: "Image data or GCS URL is required" }, { status: 400 });
  }

  try {
    // Build request body
    const requestBody: Record<string, unknown> = {
      language,
      auto_fix,
      invoice,
    };

    // If GCS URL is provided, use that
    if (gcs_url) {
      requestBody.image_data = gcs_url;
      if (gcs_access_token) {
        requestBody.gcs_access_token = gcs_access_token;
      }
    } else if (image_data) {
      // Process base64 image data
      let cleanBase64 = image_data;
      
      // Check if it's already a data URL
      if (image_data.startsWith("data:")) {
        // Extract mime type and base64
        const dataUrlMatch = image_data.match(/^data:([^;]+);base64,(.+)$/);
        if (dataUrlMatch) {
          cleanBase64 = dataUrlMatch[2];
        } else if (image_data.includes(",")) {
          // Fallback: simple split
          const parts = image_data.split(",");
          if (parts.length > 1) {
            cleanBase64 = parts[1];
          }
        }
      } else if (image_data.includes(",")) {
        // Has comma but no data: prefix - might be partial data URL
        const parts = image_data.split(",");
        if (parts.length > 1) {
          cleanBase64 = parts[1];
        }
      }
      
      // Remove ALL whitespace including newlines, spaces, tabs
      cleanBase64 = cleanBase64.replace(/\s/g, "");
      
      // Validate base64 string is not empty
      if (!cleanBase64 || cleanBase64.length === 0) {
        return NextResponse.json(
          {
            error: "Invalid image data",
            message: "Base64 image data is empty after processing",
          },
          { status: 400 }
        );
      }
      
      // Validate minimum length (base64 should be at least a few characters)
      if (cleanBase64.length < 100) {
        return NextResponse.json(
          {
            error: "Invalid image data",
            message: "Image data is too short. Please upload a valid image file.",
          },
          { status: 400 }
        );
      }
      
      // Basic base64 validation (should only contain base64 characters)
      // Base64 can contain: A-Z, a-z, 0-9, +, /, = (padding)
      const base64Regex = /^[A-Za-z0-9+/=]+$/;
      if (!base64Regex.test(cleanBase64)) {
        return NextResponse.json(
          {
            error: "Invalid image format",
            message: "Invalid base64 format. Please upload a valid image file.",
          },
          { status: 400 }
        );
      }
      
      // Validate base64 can be decoded and detect mime type
      let detectedMimeType = "image/png"; // default
      try {
        const testBuffer = Buffer.from(cleanBase64, "base64");
        if (!testBuffer || testBuffer.length === 0) {
          return NextResponse.json(
            {
              error: "Invalid image format",
              message: "Base64 data cannot be decoded. Please upload a valid image file.",
            },
            { status: 400 }
          );
        }
        
        // Check if it's a valid image by checking magic bytes and detect mime type
        const magicBytes = testBuffer.slice(0, 4);
        if (magicBytes[0] === 0xFF && magicBytes[1] === 0xD8 && magicBytes[2] === 0xFF) {
          detectedMimeType = "image/jpeg";
        } else if (magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4E && magicBytes[3] === 0x47) {
          detectedMimeType = "image/png";
        } else if (magicBytes[0] === 0x47 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46) {
          detectedMimeType = "image/gif";
        } else if (magicBytes[0] === 0x42 && magicBytes[1] === 0x4D) {
          detectedMimeType = "image/bmp";
        } else if (magicBytes[0] === 0x52 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46 && magicBytes[3] === 0x46) {
          detectedMimeType = "image/webp";
        }
      } catch (error) {
        return NextResponse.json(
          {
            error: "Invalid image format",
            message: "Base64 data cannot be decoded. Please upload a valid image file.",
          },
          { status: 400 }
        );
      }
      
      // Try sending as data URL format first (some APIs prefer this)
      // Format: data:image/jpeg;base64,{base64}
      const dataUrlFormat = `data:${detectedMimeType};base64,${cleanBase64}`;
      requestBody.image_data = dataUrlFormat;
    }

    if (custom_schema) {
      requestBody.custom_schema = custom_schema;
    }

    const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/ocr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await safeJsonParse(body);

    if (statusCode !== 200) {
      // If data URL format failed, try pure base64 format
      if (
        responseData?.error === "invalid_image_format" &&
        requestBody.image_data &&
        typeof requestBody.image_data === "string" &&
        requestBody.image_data.startsWith("data:")
      ) {
        // Extract base64 from data URL
        const base64Match = requestBody.image_data.match(/^data:[^;]+;base64,(.+)$/);
        if (base64Match && base64Match[1]) {
          const pureBase64 = base64Match[1];
          const retryRequestBody = {
            ...requestBody,
            image_data: pureBase64, // Use pure base64 instead of data URL
          };
          
          const { statusCode: retryStatus, body: retryBody } = await request(`${KOLOSAL_API_BASE}/ocr`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: apiKey,
            },
            body: JSON.stringify(retryRequestBody),
          });
          
          const retryResponseData = await safeJsonParse(retryBody);
          
          if (retryStatus === 200) {
            return NextResponse.json(retryResponseData);
          }
        }
      }
      
      // If base64 failed and we have image_data, try Cloudinary fallback
      if (
        responseData?.error === "invalid_image_format" &&
        requestBody.image_data &&
        typeof requestBody.image_data === "string" &&
        !requestBody.image_data.startsWith("http")
      ) {
        // Extract base64
        let base64ForCloudinary = requestBody.image_data;
        
        if (base64ForCloudinary.startsWith("data:")) {
          const dataUrlMatch = base64ForCloudinary.match(/^data:([^;]+);base64,(.+)$/);
          if (dataUrlMatch) {
            base64ForCloudinary = dataUrlMatch[2];
          }
        }
        
        const cloudinaryUrl = await uploadToCloudinary(base64ForCloudinary);
        
        if (cloudinaryUrl) {
          // Retry with Cloudinary URL
          const retryRequestBody = {
            ...requestBody,
            image_data: cloudinaryUrl, // Use Cloudinary URL instead of base64
          };
          
          const { statusCode: retryStatus, body: retryBody } = await request(`${KOLOSAL_API_BASE}/ocr`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: apiKey,
            },
            body: JSON.stringify(retryRequestBody),
          });
          
          const retryResponseData = await safeJsonParse(retryBody);
          
          if (retryStatus === 200) {
            return NextResponse.json(retryResponseData);
          }
        }
      }
      
      return NextResponse.json(
        {
          error: "Failed to extract text",
          details: responseData,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to extract text",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /ocr/form - Extract text using multipart/form-data
async function handleOcrForm(req: NextRequest, apiKey: string) {
  // Handle body parsing
  let bodyData: OcrRequest;
  try {
    bodyData = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        message: "Request body is empty or could not be parsed. Please ensure Content-Type is application/json.",
      },
      { status: 400 }
    );
  }

  const {
    image_data,
    language = "auto",
    invoice = false,
    custom_schema,
    gcs_access_token,
    gcs_url,
  } = bodyData;

  if (!image_data && !gcs_url) {
    return NextResponse.json({ error: "Image data or GCS URL is required" }, { status: 400 });
  }

  try {
    const formData = new FormData();

    // Add image file from base64
    if (image_data) {
      const bufferData = base64ToBuffer(image_data);
      if (!bufferData || !bufferData.buffer) {
        return NextResponse.json(
          {
            error: "Invalid image data",
            message: "Failed to decode base64 image data",
          },
          { status: 400 }
        );
      }

      const { buffer, mimeType } = bufferData;
      
      // Validate buffer is not null/empty
      if (!buffer || buffer.length === 0) {
        return NextResponse.json(
          {
            error: "Invalid image data",
            message: "Image buffer is empty",
          },
          { status: 400 }
        );
      }
      
      // Get file extension from mime type
      const getExtension = (mime: string): string => {
        const mimeMap: Record<string, string> = {
          "image/png": "png",
          "image/jpeg": "jpg",
          "image/jpg": "jpg",
          "image/webp": "webp",
          "image/bmp": "bmp",
          "image/gif": "gif",
        };
        return mimeMap[mime] || "png";
      };
      
      const ext = getExtension(mimeType);
      const filename = `image.${ext}`;
      
      // For undici FormData in Node.js, we can use Buffer directly
      // Convert Buffer to Uint8Array for better compatibility
      try {
        const uint8Array = new Uint8Array(buffer);
        
        // Try using Blob if available (Node.js 18+)
        if (typeof Blob !== "undefined" && Blob) {
          try {
            const blob = new Blob([uint8Array], { type: mimeType });
            // undici FormData.append accepts (name, value, filename?)
            formData.append("image", blob, filename);
          } catch (blobError) {
            // Fallback to Buffer if Blob fails
            // undici FormData.append accepts (name, value, filename?)
            formData.append("image", buffer, filename);
          }
        } else {
          // Use Buffer directly
          // undici FormData.append accepts (name, value, filename?)
          formData.append("image", buffer, filename);
        }
      } catch (formDataError) {
        // Fallback to JSON endpoint
        return handleOcrExtract(req, apiKey);
      }
    }

    // Add other fields
    formData.append("language", language);
    formData.append("invoice", String(invoice));

    if (custom_schema) {
      formData.append("custom_schema", custom_schema);
    }

    if (gcs_access_token) {
      formData.append("gcs_access_token", gcs_access_token);
    }

    if (gcs_url) {
      formData.append("gcs_url", gcs_url);
    }

    const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/ocr/form`, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        // Don't set Content-Type - let undici set it with boundary for multipart/form-data
      },
      body: formData,
    });

    const responseData = await safeJsonParse(body);

    if (statusCode !== 200) {
      // If form endpoint fails with image validation error, fallback to JSON endpoint
      if (
        responseData?.error === "image_validation_failed" ||
        responseData?.details?.error === "image_validation_failed"
      ) {
        try {
          return handleOcrExtract(req, apiKey);
        } catch (fallbackError) {
          // Fallback failed
        }
      }
      
      return NextResponse.json(
        {
          error: "Failed to process form",
          details: responseData,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    // If multipart/form-data fails, try falling back to JSON endpoint
    if (image_data) {
      try {
        // Fallback to extract endpoint with JSON
        return handleOcrExtract(req, apiKey);
      } catch (fallbackError) {
        // Fallback failed
      }
    }
    
    return NextResponse.json(
      {
        error: "Failed to process form",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
