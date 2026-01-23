"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Model, Workspace, AgentStats } from "@/components/utils/chatbot/chatbot";

type ChatbotSettingsProps = {
  mode: "chat" | "agent" | "detect" | "ocr";
  onModeChange: (mode: "chat" | "agent" | "detect" | "ocr") => void;
  models: Model[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  workspaces: Workspace[];
  selectedWorkspace: string;
  onWorkspaceChange: (workspaceId: string) => void;
  availableTools: string[];
  selectedTools: string[];
  onToolToggle: (toolId: string) => void;
  agentStats: AgentStats | null;
  loading: boolean;
  isTyping: boolean;
};

export function ChatbotSettings({
  mode,
  onModeChange,
  models,
  selectedModel,
  onModelChange,
  workspaces,
  selectedWorkspace,
  onWorkspaceChange,
  availableTools,
  selectedTools,
  onToolToggle,
  agentStats,
  loading,
  isTyping,
}: ChatbotSettingsProps) {
  return (
    <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-200 bg-white dark:bg-white text-black dark:text-black">
      {/* Mode Selection */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-black dark:text-black w-16">Mode:</span>
        <Select value={mode} onValueChange={onModeChange} disabled={loading || isTyping}>
          <SelectTrigger className="flex-1 h-8 text-xs text-black dark:text-black border-gray-300 dark:border-gray-300 bg-white dark:bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-white border-gray-300 dark:border-gray-300">
            <SelectItem value="chat" className="text-black dark:text-black">💬 Chat</SelectItem>
            <SelectItem value="detect" className="text-black dark:text-black">🔍 Object Detection</SelectItem>
            <SelectItem value="ocr" className="text-black dark:text-black">📝 OCR (Text Extract)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Model Selection */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-black dark:text-black w-16">Model:</span>
        {models.length > 0 && (
          <Select
            value={selectedModel}
            onValueChange={onModelChange}
            disabled={loading || isTyping}
          >
            <SelectTrigger className="flex-1 h-8 text-xs text-black dark:text-black border-gray-300 dark:border-gray-300 bg-white dark:bg-white">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-white border-gray-300 dark:border-gray-300">
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id} className="text-black dark:text-black">
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Workspace Selection (Agent mode only) */}
      {mode === "agent" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-black dark:text-black w-16">Workspace:</span>
            {workspaces.length > 0 ? (
              <Select
                value={selectedWorkspace}
                onValueChange={onWorkspaceChange}
                disabled={loading || isTyping}
              >
                <SelectTrigger className="flex-1 h-8 text-xs text-black dark:text-black border-gray-300 dark:border-gray-300 bg-white dark:bg-white">
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-white border-gray-300 dark:border-gray-300">
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id} className="text-black dark:text-black">
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs text-black dark:text-black">No workspaces</span>
            )}
          </div>

          {/* Tools Selection */}
          {availableTools.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-black dark:text-black">Tools:</span>
              <div className="space-y-1 pl-4">
                {availableTools.map((tool) => (
                  <div key={tool} className="flex items-center gap-2">
                    <Switch
                      checked={selectedTools.includes(tool)}
                      onCheckedChange={() => onToolToggle(tool)}
                      disabled={loading || isTyping}
                      className="h-4 w-7"
                    />
                    <Label className="text-xs font-normal">{tool}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Stats */}
          {agentStats && (
            <div className="pt-2 border-t space-y-1">
              <span className="text-xs text-black dark:text-black">Stats:</span>
              <div className="text-xs space-y-0.5 pl-4">
                <div>Status: {agentStats.healthy ? "✅ Healthy" : "❌ Unhealthy"}</div>
                <div>Success Rate: {agentStats.stats.success_rate.toFixed(1)}%</div>
                <div>Total Requests: {agentStats.stats.total_requests}</div>
                <div>Active Streams: {agentStats.stats.active_streams}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

