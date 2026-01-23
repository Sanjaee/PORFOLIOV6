// Type definitions for chatbot

export type Message = {
    role: "user" | "assistant";
    content: string;
    image?: string;
  };
  
  export type HistoryItem = {
    type: string;
    content: string | null;
    name: string | null;
    arguments: string | null;
  };
  
  export type Model = {
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
  
  export type Workspace = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    workspace_type: string;
  };
  
  export type AgentStats = {
    healthy: boolean;
    stats: {
      active_streams: number;
      failed_requests: number;
      success_rate: number;
      successful_requests: number;
      total_requests: number;
      total_tokens_processed: number;
    };
  };
  
  