"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ImageIcon, X } from "lucide-react";

type ChatbotInputProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  mode: "chat" | "agent" | "detect" | "ocr";
  selectedImage: string | null;
  imagePreview: string | null;
  imageError: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onImagePreviewClick: () => void;
  selectedWorkspace: string | null;
  loading: boolean;
  isTyping: boolean;
  imageInputRef: React.RefObject<HTMLInputElement>;
};

export function ChatbotInput({
  input,
  onInputChange,
  onSend,
  onKeyPress,
  mode,
  selectedImage,
  imagePreview,
  imageError,
  onImageSelect,
  onImageRemove,
  onImagePreviewClick,
  selectedWorkspace,
  loading,
  isTyping,
  imageInputRef,
}: ChatbotInputProps) {
  const getPlaceholder = () => {
    if (mode === "detect") return "Objects to detect (comma-separated)...";
    if (mode === "ocr") return "Upload image to extract text";
    if (mode === "agent") return "Ask the agent...";
    return "Type your message...";
  };

  const getHint = () => {
    if (mode === "agent" && !selectedWorkspace && !selectedImage) {
      return "⚠️ Please select or create a workspace first";
    }
    if (mode === "detect" && !selectedImage) {
      return "🔍 Upload an image to detect objects";
    }
    if (mode === "ocr" && !selectedImage) {
      return "📝 Upload an image to extract text (OCR)";
    }
    if (selectedImage && mode === "detect") {
      return "📷 Image attached. Add object names (comma-separated) or leave empty for auto-detection.";
    }
    if (selectedImage && mode === "ocr") {
      return "📷 Image attached. Click send to extract text.";
    }
    if (selectedImage && (mode === "chat" || mode === "agent")) {
      return "📷 Image attached. Switch to Detect or OCR mode to analyze the image.";
    }
    return null;
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-200 p-4 space-y-2 bg-white dark:bg-white">
      {/* Image Preview */}
      {imagePreview && (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-32 max-h-32 rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onImagePreviewClick}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onImageRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Image Error */}
      {imageError && (
        <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
          {imageError}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/bmp"
          onChange={onImageSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => imageInputRef.current?.click()}
          disabled={loading || isTyping}
          title="Upload image"
          className="text-black dark:text-black border-gray-300 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-100"
        >
          <ImageIcon className="h-4 w-4 text-black dark:text-black" />
          <span className="sr-only">Upload image</span>
        </Button>

        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={getPlaceholder()}
          disabled={loading || isTyping}
          className="flex-1 text-black dark:text-black placeholder:text-gray-500 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-300 bg-white dark:bg-white"
        />
        <Button
          onClick={onSend}
          disabled={loading || isTyping || (!input.trim() && !selectedImage)}
          size="icon"
          className="text-black dark:text-black border-gray-300 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-100 disabled:opacity-50"
        >
          <Send className="h-4 w-4 text-black dark:text-black" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>

      {/* Hint Message */}
      {getHint() && (
        <p className="text-xs text-black dark:text-black">{getHint()}</p>
      )}
    </div>
  );
}

