import { NextRequest, NextResponse } from "next/server";
import { request } from "undici";

const KOLOSAL_API_BASE = "https://api.kolosal.ai/v1/agent";

function getKolosalApiKey(): string {
  const apiKey = process.env.KOLOSAL_API_KEY;
  
  if (!apiKey) {
    throw new Error("KOLOSAL_API_KEY environment variable is not set");
  }
  
  return `Bearer ${apiKey}`;
}

type HistoryItem = {
  type: string;
  content: string | null;
  name: string | null;
  arguments: string | null;
};

type GenerateRequest = {
  input: string;
  model: string;
  workspace_id: string;
  tools?: string[];
  history?: HistoryItem[];
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
    if (action === "generate") {
      return handleGenerate(req, apiKey);
    }
    return NextResponse.json({ error: "Invalid action. Use ?action=generate" }, { status: 400 });
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
    if (action === "stats") {
      return handleStats(apiKey);
    }
    if (action === "tools") {
      return handleTools(apiKey);
    }
    return NextResponse.json({ error: "Invalid action. Use ?action=stats or ?action=tools" }, { status: 400 });
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

async function handleGenerate(req: NextRequest, apiKey: string) {
  const {
    input,
    model,
    workspace_id,
    tools = [],
    history = [],
  }: GenerateRequest = await req.json();

  if (!input) {
    return NextResponse.json({ error: "Input is required" }, { status: 400 });
  }

  try {
    const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        input,
        model,
        workspace_id,
        tools,
        history,
      }),
    });

    const responseData = await safeJsonParse(body);

    if (statusCode !== 200) {
      return NextResponse.json(
        {
          error: "Failed to generate",
          details: responseData,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function handleStats(apiKey: string) {
  try {
    const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/stats`, {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    });

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

async function handleTools(apiKey: string) {
  try {
    const { statusCode, body } = await request(`${KOLOSAL_API_BASE}/tools`, {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    });

    const responseData = await safeJsonParse(body);

    if (statusCode !== 200) {
      // Return empty tools array if API fails
      return NextResponse.json({ tools: [] });
    }

    // Ensure tools is always an array
    return NextResponse.json({
      tools: responseData.tools || [],
    });
  } catch (error) {
    // Return empty tools array on error
    return NextResponse.json({ tools: [] });
  }
}
