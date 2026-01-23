"use client";

import * as React from "react";
import { MessageCircle, Settings2, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChatbotSettings } from "@/components/chatbot/ChatbotSettings";
import { ChatbotMessages } from "@/components/chatbot/ChatbotMessages";
import { ChatbotInput } from "@/components/chatbot/ChatbotInput";
import { useChatbot } from "@/components/hooks/useChatbot";
import { handleDetectMode, handleOcrMode, handleAgentMode, handleChatMode } from "@/components/utils/chatbot/handlers";
import type { Message } from "@/components/utils/chatbot/types";

export function Chatbot() {
  const {
    open,
    setOpen,
    settingsOpen,
    setSettingsOpen,
    messages,
    setMessages,
    input,
    setInput,
    loading,
    setLoading,
    isTyping,
    setIsTyping,
    isAtBottom,
    models,
    selectedModel,
    setSelectedModel,
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    selectedTools,
    availableTools,
    agentStats,
    chatHistory,
    setChatHistory,
    mode,
    setMode,
    selectedImage,
    imagePreview,
    imageError,
    imageInputRef,
    focusedImage,
    setFocusedImage,
    messagesEndRef,
    messagesContainerRef,
    handleScroll,
    handleImageSelect,
    removeImage,
    clearChat,
    toggleTool,
  } = useChatbot();

  const display = async (text: string, messageIndex: number) => {
    setIsTyping(true);
    const chunkSize = 10;

    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.slice(i, i + chunkSize);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          content: newMessages[messageIndex].content + chunk,
        };
        return newMessages;
      });

      if (i + chunkSize < text.length) {
        await new Promise((resolve) => {
          requestAnimationFrame(resolve);
        });
      }

      if (isAtBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsTyping(false);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    const imageToSend = selectedImage;
    const imageForDisplay = imagePreview;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      image: imageForDisplay || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    removeImage();
    setLoading(true);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      let fullContent = "";
      let assistantImage: string | undefined;

      if (mode === "detect" && imageToSend) {
        const result = await handleDetectMode(imageToSend, input.trim());
        fullContent = result.content;
        assistantImage = result.image;
      } else if (mode === "ocr" && imageToSend) {
        fullContent = await handleOcrMode(imageToSend);
      } else if (mode === "agent" && selectedWorkspace) {
        const result = await handleAgentMode(
          input.trim(),
          selectedModel,
          selectedWorkspace,
          selectedTools,
          chatHistory
        );
        fullContent = result.content;
        setChatHistory(result.history);
      } else {
        fullContent = await handleChatMode([...messages, userMessage], selectedModel);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        image: assistantImage,
      };

      let messageIndex = 0;
      setMessages((prev) => {
        const newMessages = [...prev, assistantMessage];
        messageIndex = newMessages.length - 1;
        return newMessages;
      });
      setLoading(false);

      await display(fullContent, messageIndex);
    } catch (error) {
      console.error("Chat error:", error);
      // Extract error message from error object
      let errorContent = "Maaf, terjadi kesalahan. Silakan coba lagi.";
      if (error instanceof Error) {
        errorContent = error.message || errorContent;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorContent = String((error as any).message) || errorContent;
      }
      
      const errorMessage: Message = {
        role: "assistant",
        content: "",
      };

      let errorMessageIndex = 0;
      setMessages((prev) => {
        const newMessages = [...prev, errorMessage];
        errorMessageIndex = newMessages.length - 1;
        return newMessages;
      });
      setLoading(false);

      await display(errorContent, errorMessageIndex);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-lg group-hover:opacity-30 transition-opacity" />
        <Button
          onClick={() => setOpen(true)}
          className="relative h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all border-0"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="sr-only">Open chat</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col h-[700px] max-w-lg p-0 bg-white dark:bg-white">
          <DialogHeader className="px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-200 space-y-3 bg-white dark:bg-white">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="flex items-center gap-2 text-base text-black dark:text-black">
                <MessageCircle className="h-5 w-5 text-black dark:text-black" />
                AI Agent
              </DialogTitle>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="h-8 w-28 text-black dark:text-black border-gray-300 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-100"
                  title="Settings"
                >
                  <Settings2 className="h-4 w-4 text-black dark:text-black" />
                  <span className="text-black dark:text-black">Settings</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearChat}
                  className="h-8 w-8 text-black dark:text-black border-gray-300 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-100"
                  title="Clear chat"
                >
                  <RefreshCw className="h-4 w-4 text-black dark:text-black" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 text-black dark:text-black border-gray-300 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-100"
                  title="Close"
                >
                  <X className="h-4 w-4 text-black dark:text-black" />
                </Button>
              </div>
            </div>

            {settingsOpen && (
              <ChatbotSettings
                mode={mode}
                onModeChange={setMode}
                models={models}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                workspaces={workspaces}
                selectedWorkspace={selectedWorkspace}
                onWorkspaceChange={setSelectedWorkspace}
                availableTools={availableTools}
                selectedTools={selectedTools}
                onToolToggle={toggleTool}
                agentStats={agentStats}
                loading={loading}
                isTyping={isTyping}
              />
            )}
          </DialogHeader>

          <ChatbotMessages
            messages={messages}
            messagesEndRef={messagesEndRef}
            messagesContainerRef={messagesContainerRef}
            onScroll={handleScroll}
            focusedImage={focusedImage}
            onImageFocus={setFocusedImage}
          />

          {loading && (
            <div className="flex justify-start px-4 bg-white dark:bg-white">
              <div className="bg-gray-100 dark:bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div
                    className="h-2 w-2 bg-gray-600 dark:bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="h-2 w-2 bg-gray-600 dark:bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="h-2 w-2 bg-gray-600 dark:bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <ChatbotInput
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onKeyPress={handleKeyPress}
            mode={mode}
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            imageError={imageError}
            onImageSelect={handleImageSelect}
            onImageRemove={removeImage}
            onImagePreviewClick={() => setFocusedImage(imagePreview)}
            selectedWorkspace={selectedWorkspace}
            loading={loading}
            isTyping={isTyping}
            imageInputRef={imageInputRef}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
