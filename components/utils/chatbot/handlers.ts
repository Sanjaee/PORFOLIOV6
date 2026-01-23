// Message handling utilities

import { detectObjects, extractText, sendChatMessage, sendAgentMessage } from "./api";
import { stripDataUrlPrefix } from "@/components/utils/chatbot/image";
import type { Message, HistoryItem } from "@/components/utils/chatbot/types";

export async function handleDetectMode(
  image: string,
  prompts: string
): Promise<{ content: string; image?: string }> {
  const base64Image = stripDataUrlPrefix(image);
  const detectData = await detectObjects(
    base64Image,
    prompts ? prompts.split(",").map((p) => p.trim()) : [],
    0.5
  );

  let annotatedImage: string | undefined;
  if (detectData.annotated_image) {
    annotatedImage = `data:image/png;base64,${detectData.annotated_image}`;
  }

  if (detectData.error) {
    return {
      content: `**Error:** ${detectData.detail || detectData.error}`,
      image: annotatedImage,
    };
  }

  if (detectData.results && detectData.results.length > 0) {
    const objectCounts: Record<string, number> = {};
    detectData.results.forEach((result: { name: string }) => {
      objectCounts[result.name] = (objectCounts[result.name] || 0) + 1;
    });
    const summary = Object.entries(objectCounts)
      .map(([name, count]) => `${count} ${name}${count > 1 ? "s" : ""}`)
      .join(", ");
    return {
      content: `✅ Detected: ${summary}`,
      image: annotatedImage,
    };
  }

  return {
    content: prompts ? `No objects detected. Searched for: ${prompts}` : "No objects detected.",
    image: annotatedImage,
  };
}

export async function handleOcrMode(image: string): Promise<string> {
  const base64Image = stripDataUrlPrefix(image);
  const ocrData = await extractText(base64Image, "auto");

  if (ocrData.error) {
    const errorDetail =
      ocrData.details?.message || ocrData.details?.error || ocrData.error;
    return `**Error:** ${errorDetail}`;
  }

  if (ocrData.text || ocrData.extracted_text || ocrData.result || ocrData.content) {
    const extractedText =
      ocrData.text || ocrData.extracted_text || ocrData.result || ocrData.content || "";
    return `📝 **Extracted Text:**\n\n${extractedText}`;
  }

  if (ocrData.blocks || ocrData.lines || ocrData.paragraphs) {
    const items = ocrData.blocks || ocrData.lines || ocrData.paragraphs || [];
    const text = items
      .map(
        (b: { text?: string; content?: string; value?: string }) =>
          b.text || b.content || b.value || ""
      )
      .join("\n");
    return `📝 **Extracted Text:**\n\n${text || "No text found in image."}`;
  }

  if (typeof ocrData === "object" && Object.keys(ocrData).length > 0) {
    const possibleTextFields = [
      "text",
      "content",
      "result",
      "extracted_text",
      "ocr_text",
      "data",
    ];
    for (const field of possibleTextFields) {
      if (ocrData[field] && typeof ocrData[field] === "string") {
        return `📝 **Extracted Text:**\n\n${ocrData[field]}`;
      }
    }
    return `📝 **OCR Result:**\n\n\`\`\`json\n${JSON.stringify(ocrData, null, 2)}\n\`\`\``;
  }

  return "📝 No text found in the image.";
}

export async function handleAgentMode(
  input: string,
  model: string,
  workspaceId: string,
  tools: string[],
  history: HistoryItem[]
): Promise<{ content: string; history: HistoryItem[] }> {
  const data = await sendAgentMessage(input, model, workspaceId, tools, history);
  const content = data.output || "Sorry, I couldn't process that.";

  const newHistory: HistoryItem[] = [
    ...history,
    { type: "user", content: input, name: null, arguments: null },
    { type: "assistant", content, name: null, arguments: null },
  ];

  return { content, history: newHistory };
}

export async function handleChatMode(
  messages: Message[],
  model: string
): Promise<string> {
  const data = await sendChatMessage(
    messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    model
  );
  return data.choices[0]?.message?.content || "Sorry, I couldn't process that.";
}

