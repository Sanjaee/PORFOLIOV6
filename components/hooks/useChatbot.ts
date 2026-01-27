import { useState, useCallback, useRef, useEffect } from "react";
import { fetchModels, fetchWorkspaces, fetchAgentTools, fetchAgentStats } from "@/components/utils/chatbot/api";
import { fileToBase64, validateFileType, validateFileSize } from "@/components/utils/chatbot/image";
import { displayText } from "@/components/utils/chatbot/typing";
import type { Message, HistoryItem, Model, Workspace, AgentStats } from "@/components/utils/chatbot/types";

export function useChatbot() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "**AI Agent**\n\nHalo! Saya AI Agent dari Zacode, platform penyedia template coding terpercaya.\n\n**Pilihan Mode** (di atas):\n- **Chat**: Percakapan dengan AI\n- **OCR**: Ekstrak teks dari gambar\n- **Object Detection**: Deteksi objek dalam gambar\n\n**Pilihan Model AI** (di atas): Pilih model sesuai kebutuhan Anda.\n\n**Layanan**: Template coding, informasi saham & crypto, edukasi investasi, dan monitoring portfolio.\n\nPilih mode dan model untuk memulai!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Models
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(
    "meta-llama/llama-4-maverick-17b-128e-instruct"
  );

  // Workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");

  // Tools
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [availableTools, setAvailableTools] = useState<string[]>([]);

  // Agent Stats
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null);

  // Chat History
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);

  // Mode
  const [mode, setMode] = useState<"chat" | "agent" | "detect" | "ocr">("chat");

  // Image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [focusedImage, setFocusedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const checkIfAtBottom = useCallback(() => {
    if (!messagesContainerRef.current) return false;
    const container = messagesContainerRef.current;
    const threshold = 100;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  const handleScroll = useCallback(() => {
    setIsAtBottom(checkIfAtBottom());
  }, [checkIfAtBottom]);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open && models.length === 0) {
      fetchModels()
        .then((data) => {
          if (data.models && Array.isArray(data.models)) {
            setModels(data.models);
            if (!selectedModel && data.models.length > 0) {
              setSelectedModel(data.models[0].id);
            }
          }
        })
        .catch(console.error);
    }
  }, [open, models.length, selectedModel]);

  useEffect(() => {
    if (open && workspaces.length === 0) {
      fetchWorkspaces()
        .then((data) => {
          if (data.workspaces && Array.isArray(data.workspaces)) {
            setWorkspaces(data.workspaces);
            if (!selectedWorkspace && data.workspaces.length > 0) {
              setSelectedWorkspace(data.workspaces[0].id);
            }
          }
        })
        .catch(console.error);
    }
  }, [open, workspaces.length, selectedWorkspace]);

  useEffect(() => {
    if (open) {
      fetchAgentTools()
        .then((data) => {
          if (data.tools && Array.isArray(data.tools)) {
            setAvailableTools(data.tools);
          }
        })
        .catch(console.error);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchAgentStats()
        .then(setAgentStats)
        .catch(console.error);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      // Defer state update to avoid cascading renders
      requestAnimationFrame(() => {
        setIsAtBottom(true);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 1);
      });
    }
  }, [open]);

  const processImageFile = useCallback(async (file: File) => {
    setImageError(null);

    if (!validateFileType(file)) {
      setImageError("Invalid file type. Supported: jpeg, png, webp, bmp");
      return;
    }

    if (!validateFileSize(file)) {
      setImageError("File too large. Maximum size: 10MB");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setSelectedImage(base64);
      setImagePreview(base64);
    } catch (error) {
      setImageError("Failed to process image");
    }
  }, []);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processImageFile(file);
    },
    [processImageFile]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (!open || loading || isTyping) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const itemsArray = Array.from(items);
      for (const item of itemsArray) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) processImageFile(file);
          break;
        }
      }
    },
    [open, loading, isTyping, processImageFile]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("paste", handlePaste);
      return () => document.removeEventListener("paste", handlePaste);
    }
  }, [open, handlePaste]);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageError(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content: "Chat dibersihkan! Saya siap membantu Anda dengan template coding dari Zacode dan informasi investasi seputar saham dan crypto. Bagaimana saya bisa membantu Anda hari ini?",
      },
    ]);
    setChatHistory([]);
    removeImage();
  }, [removeImage]);

  const toggleTool = useCallback((toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  }, []);

  return {
    // State
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
    // Functions
    handleScroll,
    processImageFile,
    handleImageSelect,
    removeImage,
    clearChat,
    toggleTool,
  };
}

