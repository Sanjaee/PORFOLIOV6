"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { parseMarkdown } from "@/components/utils/chatbot/markdown";
import type { Message } from "@/components/utils/chatbot/chatbot";
import { cn } from "@/lib/utils";

type ChatbotMessagesProps = {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  focusedImage: string | null;
  onImageFocus: (image: string | null) => void;
};

export function ChatbotMessages({
  messages,
  messagesEndRef,
  messagesContainerRef,
  onScroll,
  focusedImage,
  onImageFocus,
}: ChatbotMessagesProps) {
  return (
    <>
      <div
        ref={messagesContainerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-white dark:bg-white"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-white dark:bg-white border border-gray-200 dark:border-gray-200 flex items-center justify-center shrink-0">
                <span className="text-sm text-black dark:text-black font-medium">AI</span>
              </div>
            )}
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[80%]",
                message.role === "user"
                  ? "bg-gray-800 dark:bg-gray-800 text-white dark:text-white"
                  : "bg-gray-100 dark:bg-gray-100 text-black dark:text-black"
              )}
            >
              {message.image && (
                <div className="mb-2">
                  <img
                    src={message.image}
                    alt="Attached"
                    className="max-w-full max-h-48 rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onImageFocus(message.image!)}
                  />
                </div>
              )}
              <div
                className={cn(
                  "prose prose-sm dark:prose-invert max-w-none",
                  message.role === "user"
                    ? "text-white dark:text-white [&_*]:text-white [&_*]:dark:text-white"
                    : "text-black dark:text-black [&_*]:text-black [&_*]:dark:text-black"
                )}
              >
                {parseMarkdown(message.content)}
              </div>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <span className="text-sm text-white dark:text-white font-medium">U</span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Focus Dialog */}
      <Dialog open={!!focusedImage} onOpenChange={() => onImageFocus(null)}>
        <DialogContent className="max-w-[95vw] w-fit max-h-[95vh]">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          {focusedImage && (
            <img
              src={focusedImage}
              alt="Focused"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

