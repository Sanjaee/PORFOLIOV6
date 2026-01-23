import { NextRequest, NextResponse } from "next/server";
import { request } from "undici";

const KOLOSAL_API_URL = "https://api.kolosal.ai/v1/models";

function getKolosalApiKey(): string {
  const apiKey = process.env.KOLOSAL_API_KEY;
  
  if (!apiKey) {
    throw new Error("KOLOSAL_API_KEY environment variable is not set");
  }
  
  return `Bearer ${apiKey}`;
}

type Model = {
  id: string;
  name: string;
  pricing: {
    input: number;
    output: number;
    currency: string;
    unit: string;
  };
  contextSize: number;
  lastUpdated: string;
};

type ModelsResponse = {
  models: Model[];
  count: number;
};

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

  try {
    const { statusCode, body } = await request(KOLOSAL_API_URL, {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    });

    const responseData = (await body.json()) as ModelsResponse;

    if (statusCode !== 200) {
      return NextResponse.json(
        {
          error: "Failed to get models",
          details: responseData,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(responseData);
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
