import { NextRequest, NextResponse } from "next/server";
import { request } from "undici";
import { rateLimit, getRateLimitHeaders } from "../../utils/rateLimit";

const KOLOSAL_API_URL = "https://api.kolosal.ai/v1/chat/completions";

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

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatRequest = {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
};

type ChatResponse = {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    total_tokens: number;
  };
};

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

  try {
    const { messages, model = "meta-llama/llama-4-maverick-17b-128e-instruct", max_tokens = 1000 }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const { statusCode, body } = await request(KOLOSAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        messages,
        model,
        max_tokens,
      }),
    });

    const responseData = (await body.json()) as ChatResponse;

    let response: NextResponse;
    if (statusCode !== 200) {
      response = NextResponse.json(
        {
          error: "Failed to get chat completion",
          details: responseData,
        },
        { status: statusCode }
      );
    } else {
      response = NextResponse.json(responseData);
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
