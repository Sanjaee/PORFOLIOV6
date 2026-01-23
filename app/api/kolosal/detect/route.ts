import { NextRequest, NextResponse } from "next/server";
import { request } from "undici";

const KOLOSAL_API_BASE = "https://api.kolosal.ai";

function getKolosalApiKey(): string {
  const apiKey = process.env.KOLOSAL_API_KEY;
  
  if (!apiKey) {
    throw new Error("KOLOSAL_API_KEY environment variable is not set");
  }
  
  return `Bearer ${apiKey}`;
}

// Supported file types
const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/bmp"];
const SUPPORTED_EXTENSIONS = ["jpeg", "jpg", "png", "webp", "bmp"];

// Helper function to safely parse JSON response
async function safeJsonParse(body: { text: () => Promise<string> }) {
  const text = await body.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text || "Unknown error" };
  }
}

// Validate file type from base64
function validateFileType(base64: string): boolean {
  // Check for data URL prefix
  if (base64.startsWith("data:")) {
    const mimeMatch = base64.match(/^data:([^;]+);/);
    if (mimeMatch) {
      return SUPPORTED_TYPES.includes(mimeMatch[1]);
    }
  }
  return true; // Assume valid if no prefix
}

export async function GET(req: NextRequest) {
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
    if (action === "cache") {
      return handleCache(apiKey);
    }
    if (action === "health") {
      return handleHealth(apiKey);
    }
    if (action === "stats") {
      return handleStats(apiKey);
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
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

export async function POST(req: NextRequest) {
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
    if (action === "segment") {
      return handleSegmentBase64(req, apiKey);
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
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

export async function DELETE(req: NextRequest) {
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
    if (action === "cache-delete") {
      return handleCacheDelete(apiKey);
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
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

// GET /v1/cache
async function handleCache(apiKey: string) {
  try {
    const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/v1/cache`, {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    });

    const responseData = await safeJsonParse(body);

    if (statusCode !== 200) {
      return NextResponse.json(
        {
          error: "Failed to get cache",
          details: responseData,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get cache",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /v1/cache
async function handleCacheDelete(apiKey: string) {
  try {
    const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/v1/cache`, {
      method: "DELETE",
      headers: {
        Authorization: apiKey,
      },
    });

    const responseData = await safeJsonParse(body);

    if (statusCode !== 200) {
      return NextResponse.json(
        {
          error: "Failed to delete cache",
          details: responseData,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete cache",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /v1/detect/health
async function handleHealth(apiKey: string) {
  try {
    const { statusCode, body } = await request(
      `${KOLOSAL_API_BASE}/v1/detect/health`,
      {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
      }
    );

    const responseData = await safeJsonParse(body);

    if (statusCode !== 200) {
      return NextResponse.json(
        {
          error: "Failed to get health",
          details: responseData,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get health",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /v1/detect/stats
async function handleStats(apiKey: string) {
  try {
    const { statusCode, body } = await request(
      `${KOLOSAL_API_BASE}/v1/detect/stats`,
      {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
      }
    );

    const responseData = await safeJsonParse(body);

    if (statusCode !== 200) {
      return NextResponse.json(
        {
          error: "Failed to get stats",
          details: responseData,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get stats",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /detect?action=segment
async function handleSegmentBase64(req: NextRequest, apiKey: string) {
  // Handle body parsing
  let bodyData: {
    image?: string;
    prompts?: string[];
    return_annotated?: boolean;
    return_masks?: boolean;
    threshold?: number;
  };
  
  try {
    bodyData = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        message: "Request body is empty or could not be parsed.",
      },
      { status: 400 }
    );
  }

  const {
    image,
    prompts = [],
    return_annotated = true,
    return_masks = true,
    threshold = 0.5,
  } = bodyData;

  if (!image) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  // Process base64 image data similar to OCR
  let processedImage = image;
  let detectedMimeType = "image/png"; // default
  
  // If it's a data URL, extract base64 and mime type
  if (image.startsWith("data:")) {
    const dataUrlMatch = image.match(/^data:([^;]+);base64,(.+)$/);
    if (dataUrlMatch) {
      detectedMimeType = dataUrlMatch[1];
      processedImage = dataUrlMatch[2];
    } else if (image.includes(",")) {
      const parts = image.split(",");
      if (parts.length > 1) {
        processedImage = parts[1];
        const header = parts[0];
        const mimeMatch = header.match(/data:([^;]+);/);
        if (mimeMatch) {
          detectedMimeType = mimeMatch[1];
        }
      }
    }
  } else if (image.includes(",")) {
    // Has comma but no data: prefix
    const parts = image.split(",");
    if (parts.length > 1) {
      processedImage = parts[1];
    }
  }
  
  // Remove ALL whitespace
  processedImage = processedImage.replace(/\s/g, "");
  
  // Validate and detect mime type from buffer
  try {
    const testBuffer = Buffer.from(processedImage, "base64");
    if (testBuffer && testBuffer.length > 0) {
      const magicBytes = testBuffer.slice(0, 4);
      if (magicBytes[0] === 0xFF && magicBytes[1] === 0xD8 && magicBytes[2] === 0xFF) {
        detectedMimeType = "image/jpeg";
      } else if (magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4E && magicBytes[3] === 0x47) {
        detectedMimeType = "image/png";
      } else if (magicBytes[0] === 0x47 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46) {
        detectedMimeType = "image/gif";
      } else if (magicBytes[0] === 0x42 && magicBytes[1] === 0x4D) {
        detectedMimeType = "image/bmp";
      }
    }
  } catch {
    // Ignore detection errors
  }
  
  // Validate base64
  if (!processedImage || processedImage.length === 0) {
    return NextResponse.json(
      {
        error: "Invalid image data",
        message: "Base64 image data is empty after processing",
      },
      { status: 400 }
    );
  }
  
  // Validate minimum length
  if (processedImage.length < 100) {
    return NextResponse.json(
      {
        error: "Invalid image data",
        message: "Image data is too short.",
      },
      { status: 400 }
    );
  }
  
  // Validate base64 format
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  if (!base64Regex.test(processedImage)) {
    return NextResponse.json(
      {
        error: "Invalid image format",
        message: "Invalid base64 format.",
      },
      { status: 400 }
    );
  }

  // Validate file type
  if (!validateFileType(image)) {
    return NextResponse.json(
      {
        error: "Invalid file type",
        detail: "Invalid file type. Supported: jpeg, png, webp, bmp",
      },
      { status: 400 }
    );
  }

  try {
    // Try different endpoints - Kolosal API might use different endpoint structure
    const endpoints = [
      `${KOLOSAL_API_BASE}/detect`,
      `${KOLOSAL_API_BASE}/v1/detect`,
      `${KOLOSAL_API_BASE}/v1/detect/segment`,
      `${KOLOSAL_API_BASE}/v1/segment/base64`,
    ];
    
    let lastError: any = null;
    let lastResponse: any = null;
    
    for (const endpoint of endpoints) {
      try {
        // Try both formats: pure base64 and data URL
        const requestBodies = [
          {
            image: processedImage, // Pure base64
            prompts,
            return_annotated,
            return_masks,
            threshold,
          },
          {
            image: `data:${detectedMimeType};base64,${processedImage}`, // Data URL format
            prompts,
            return_annotated,
            return_masks,
            threshold,
          },
        ];
        
        for (const requestBody of requestBodies) {
          try {
            const { statusCode, body } = await request(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: apiKey,
              },
              body: JSON.stringify(requestBody),
            });

            const responseData = await safeJsonParse(body);

            if (statusCode === 200) {
              return NextResponse.json(responseData);
            }
            
            // If 403 or 404, try next format or endpoint
            if (statusCode === 403 || statusCode === 404) {
              lastError = responseData;
              lastResponse = { statusCode, responseData };
              continue;
            }
            
            // For other errors, return immediately
            return NextResponse.json(
              {
                error: "Failed to segment image",
                details: responseData,
              },
              { status: statusCode }
            );
          } catch (formatError) {
            lastError = formatError;
            continue;
          }
        }
      } catch (endpointError) {
        lastError = endpointError;
        continue;
      }
    }
    
    // If all endpoints failed
    return NextResponse.json(
      {
        error: "Failed to segment image",
        details: lastError || { error: "All endpoints failed" },
      },
      { status: lastResponse?.statusCode || 500 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to segment image",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Export supported types for frontend validation
export const supportedTypes = SUPPORTED_TYPES;
export const supportedExtensions = SUPPORTED_EXTENSIONS;
