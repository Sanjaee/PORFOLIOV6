// API call utilities for chatbot

export async function fetchModels(): Promise<any> {
    const res = await fetch("/api/kolosal/model");
    if (!res.ok) throw new Error("Failed to fetch models");
    return res.json();
  }
  
  export async function fetchWorkspaces(): Promise<any> {
    const res = await fetch("/api/kolosal/workspace?action=list");
    if (!res.ok) throw new Error("Failed to fetch workspaces");
    return res.json();
  }
  
  export async function fetchAgentTools(): Promise<any> {
    const res = await fetch("/api/kolosal/agent?action=tools");
    if (!res.ok) throw new Error("Failed to fetch tools");
    return res.json();
  }
  
  export async function fetchAgentStats(): Promise<any> {
    const res = await fetch("/api/kolosal/agent?action=stats");
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  }
  
  export async function sendChatMessage(
    messages: Array<{ role: string; content: string }>,
    model: string
  ): Promise<any> {
    const res = await fetch("/api/kolosal/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, model }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  }
  
  export async function sendAgentMessage(
    input: string,
    model: string,
    workspaceId: string,
    tools: string[],
    history: any[]
  ): Promise<any> {
    const res = await fetch("/api/kolosal/agent?action=generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, model, workspace_id: workspaceId, tools, history }),
    });
    if (!res.ok) throw new Error("Failed to send agent message");
    return res.json();
  }
  
  export async function detectObjects(
    image: string,
    prompts: string[] = [],
    threshold = 0.5
  ): Promise<any> {
    const res = await fetch("/api/kolosal/detect?action=segment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image,
        prompts,
        return_annotated: true,
        return_masks: true,
        threshold,
      }),
    });
    if (!res.ok) throw new Error("Failed to detect objects");
    return res.json();
  }
  
  export async function extractText(image: string, language = "auto"): Promise<any> {
    // Try form endpoint first (multipart/form-data is more reliable)
    const res = await fetch("/api/kolosal/ocr?action=form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_data: image,
        language,
        invoice: false,
      }),
    });
    if (!res.ok) throw new Error("Failed to extract text");
    return res.json();
  }
  
  