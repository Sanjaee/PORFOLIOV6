import { NextRequest, NextResponse } from "next/server";
import { request } from "undici";
import { rateLimit, getRateLimitHeaders } from "../../utils/rateLimit";

const KOLOSAL_API_BASE = "https://api.kolosal.ai/v1/workspaces";

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

// Helper function to safely parse JSON response
async function safeJsonParse(body: { text: () => Promise<string> }) {
  const text = await body.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text || "Unknown error" };
  }
}

export async function GET(req: NextRequest) {
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
  const workspace_id = searchParams.get("workspace_id");
  const category_id = searchParams.get("category_id");
  const feature_id = searchParams.get("feature_id");

  try {
    let response: NextResponse;
    switch (action) {
      // Workspace actions
      case "list":
        response = await handleList(apiKey);
        break;
      case "get":
        response = await handleGet(workspace_id as string, apiKey);
        break;
      case "stats":
        response = await handleStats(apiKey);
        break;
      case "status":
        response = await handleStatus(workspace_id as string, apiKey);
        break;
      
      // Order actions
      case "order":
        response = await handleOrder(apiKey);
        break;
      case "order-stats":
        response = await handleOrderStats(apiKey);
        break;
      
      // Category actions
      case "categories":
        response = await handleCategories(workspace_id as string, apiKey);
        break;
      case "category-get":
        response = await handleCategoryGet(workspace_id as string, category_id as string, apiKey);
        break;
      case "category-order":
        response = await handleCategoryOrder(workspace_id as string, apiKey);
        break;
      
      // Feature actions
      case "features":
        response = await handleFeatures(workspace_id as string, category_id as string, apiKey);
        break;
      case "feature-get":
        response = await handleFeatureGet(workspace_id as string, category_id as string, feature_id as string, apiKey);
        break;
      case "feature-order":
        response = await handleFeatureOrder(workspace_id as string, category_id as string, apiKey);
        break;
      
      default:
        response = NextResponse.json({ error: "Invalid action" }, { status: 400 });
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
  const workspace_id = searchParams.get("workspace_id");
  const category_id = searchParams.get("category_id");

  try {
    let response: NextResponse;
    switch (action) {
      case "create":
        response = await handleCreate(req, apiKey);
        break;
      case "category-create":
        response = await handleCategoryCreate(req, workspace_id as string, apiKey);
        break;
      case "feature-create":
        response = await handleFeatureCreate(req, workspace_id as string, category_id as string, apiKey);
        break;
      default:
        response = NextResponse.json({ error: "Invalid action" }, { status: 400 });
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

export async function PATCH(req: NextRequest) {
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
  const workspace_id = searchParams.get("workspace_id");
  const category_id = searchParams.get("category_id");
  const feature_id = searchParams.get("feature_id");

  try {
    let response: NextResponse;
    switch (action) {
      case "update":
        response = await handleUpdate(req, workspace_id as string, apiKey);
        break;
      case "category-update":
        response = await handleCategoryUpdate(req, workspace_id as string, category_id as string, apiKey);
        break;
      case "feature-update":
        response = await handleFeatureUpdate(req, workspace_id as string, category_id as string, feature_id as string, apiKey);
        break;
      default:
        response = NextResponse.json({ error: "Invalid action" }, { status: 400 });
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

export async function PUT(req: NextRequest) {
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
  const workspace_id = searchParams.get("workspace_id");
  const category_id = searchParams.get("category_id");

  try {
    let response: NextResponse;
    switch (action) {
      case "order-update":
        response = await handleOrderUpdate(req, apiKey);
        break;
      case "category-order-update":
        response = await handleCategoryOrderUpdate(req, workspace_id as string, apiKey);
        break;
      case "feature-order-update":
        response = await handleFeatureOrderUpdate(req, workspace_id as string, category_id as string, apiKey);
        break;
      default:
        response = NextResponse.json({ error: "Invalid action" }, { status: 400 });
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

export async function DELETE(req: NextRequest) {
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
  const workspace_id = searchParams.get("workspace_id");
  const category_id = searchParams.get("category_id");
  const feature_id = searchParams.get("feature_id");

  try {
    let response: NextResponse;
    switch (action) {
      case "delete":
        response = await handleDelete(workspace_id as string, apiKey);
        break;
      case "category-delete":
        response = await handleCategoryDelete(workspace_id as string, category_id as string, apiKey);
        break;
      case "feature-delete":
        response = await handleFeatureDelete(workspace_id as string, category_id as string, feature_id as string, apiKey);
        break;
      default:
        response = NextResponse.json({ error: "Invalid action" }, { status: 400 });
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

// ==================== WORKSPACE HANDLERS ====================

async function handleList(apiKey: string) {
  const { statusCode, body } = await request(KOLOSAL_API_BASE, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleCreate(req: NextRequest, apiKey: string) {
  const body = await req.json();
  const { statusCode, body: responseBody } = await request(KOLOSAL_API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify(body),
  });
  const data = await safeJsonParse(responseBody);
  return NextResponse.json(data, { status: statusCode === 200 || statusCode === 201 ? 200 : statusCode });
}

async function handleGet(workspaceId: string, apiKey: string) {
  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleDelete(workspaceId: string, apiKey: string) {
  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}`, {
    method: "DELETE",
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleUpdate(req: NextRequest, workspaceId: string, apiKey: string) {
  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  const body = await req.json();
  const { statusCode, body: responseBody } = await request(`${KOLOSAL_API_BASE}/${workspaceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify(body),
  });
  const data = await safeJsonParse(responseBody);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleStats(apiKey: string) {
  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/stats`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleStatus(workspaceId: string, apiKey: string) {
  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/status`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

// ==================== ORDER HANDLERS ====================

async function handleOrder(apiKey: string) {
  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/order`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleOrderUpdate(req: NextRequest, apiKey: string) {
  const body = await req.json();
  const { statusCode, body: responseBody } = await request(`${KOLOSAL_API_BASE}/order`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify(body),
  });
  const data = await safeJsonParse(responseBody);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleOrderStats(apiKey: string) {
  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/order/stats`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

// ==================== CATEGORY HANDLERS ====================

async function handleCategories(workspaceId: string, apiKey: string) {
  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleCategoryCreate(req: NextRequest, workspaceId: string, apiKey: string) {
  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  const body = await req.json();
  const { statusCode, body: responseBody } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify({ ...body, workspace_id: workspaceId }),
  });
  const data = await safeJsonParse(responseBody);
  return NextResponse.json(data, { status: statusCode === 200 || statusCode === 201 ? 200 : statusCode });
}

async function handleCategoryGet(workspaceId: string, categoryId: string, apiKey: string) {
  if (!workspaceId || !categoryId) return NextResponse.json({ error: "Workspace ID and Category ID required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleCategoryDelete(workspaceId: string, categoryId: string, apiKey: string) {
  if (!workspaceId || !categoryId) return NextResponse.json({ error: "Workspace ID and Category ID required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}`, {
    method: "DELETE",
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleCategoryUpdate(req: NextRequest, workspaceId: string, categoryId: string, apiKey: string) {
  if (!workspaceId || !categoryId) return NextResponse.json({ error: "Workspace ID and Category ID required" }, { status: 400 });

  const body = await req.json();
  const { statusCode, body: responseBody } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify(body),
  });
  const data = await safeJsonParse(responseBody);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleCategoryOrder(workspaceId: string, apiKey: string) {
  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/order`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleCategoryOrderUpdate(req: NextRequest, workspaceId: string, apiKey: string) {
  if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });

  const body = await req.json();
  const { statusCode, body: responseBody } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/order`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify({ ...body, workspace_id: workspaceId }),
  });
  const data = await safeJsonParse(responseBody);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

// ==================== FEATURE HANDLERS ====================

async function handleFeatures(workspaceId: string, categoryId: string, apiKey: string) {
  if (!workspaceId || !categoryId) return NextResponse.json({ error: "Workspace ID and Category ID required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}/features`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleFeatureCreate(req: NextRequest, workspaceId: string, categoryId: string, apiKey: string) {
  if (!workspaceId || !categoryId) return NextResponse.json({ error: "Workspace ID and Category ID required" }, { status: 400 });

  const body = await req.json();
  const { statusCode, body: responseBody } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}/features`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify({ ...body, category_id: categoryId }),
  });
  const data = await safeJsonParse(responseBody);
  return NextResponse.json(data, { status: statusCode === 200 || statusCode === 201 ? 200 : statusCode });
}

async function handleFeatureGet(workspaceId: string, categoryId: string, featureId: string, apiKey: string) {
  if (!workspaceId || !categoryId || !featureId) return NextResponse.json({ error: "All IDs required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}/features/${featureId}`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleFeatureDelete(workspaceId: string, categoryId: string, featureId: string, apiKey: string) {
  if (!workspaceId || !categoryId || !featureId) return NextResponse.json({ error: "All IDs required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}/features/${featureId}`, {
    method: "DELETE",
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleFeatureUpdate(req: NextRequest, workspaceId: string, categoryId: string, featureId: string, apiKey: string) {
  if (!workspaceId || !categoryId || !featureId) return NextResponse.json({ error: "All IDs required" }, { status: 400 });

  const body = await req.json();
  const { statusCode, body: responseBody } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}/features/${featureId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify(body),
  });
  const data = await safeJsonParse(responseBody);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleFeatureOrder(workspaceId: string, categoryId: string, apiKey: string) {
  if (!workspaceId || !categoryId) return NextResponse.json({ error: "Workspace ID and Category ID required" }, { status: 400 });

  const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}/features/order`, {
    headers: { Authorization: apiKey },
  });
  const data = await safeJsonParse(body);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}

async function handleFeatureOrderUpdate(req: NextRequest, workspaceId: string, categoryId: string, apiKey: string) {
  if (!workspaceId || !categoryId) return NextResponse.json({ error: "Workspace ID and Category ID required" }, { status: 400 });

  const body = await req.json();
  const { statusCode, body: responseBody } = await request(`${KOLOSAL_API_BASE}/${workspaceId}/categories/${categoryId}/features/order`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify({ ...body, category_id: categoryId }),
  });
  const data = await safeJsonParse(responseBody);
  return NextResponse.json(data, { status: statusCode === 200 ? 200 : statusCode });
}
