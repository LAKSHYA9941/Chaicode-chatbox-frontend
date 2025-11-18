/**
 * ChatInput Component - Modern chat input with send button
 * Features: Auto-resize, keyboard shortcuts, loading states
 * Uses: shadcn/ui components, lucide icons
 */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Send, Loader2, Mic, PauseCircle } from "lucide-react";

export const ChatInput = ({ 
  onSend, 
  isLoading = false, 
  placeholder = "Type your message...",
  className,
  voiceAgent,
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    onSend(message.trim());
    setMessage("");
    
    // Refocus input after sending
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div 
      className={cn(
        "border-t border-cyan-500/20 glass-dark shadow-[0_-25px_60px_-40px_rgba(34,211,238,0.45)]",
        className
      )}
    >
      <form onSubmit={handleSubmit} className="flex max-w-4xl mx-auto gap-3 my-2">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-slate-950/60 border-cyan-500/20 text-white placeholder:text-cyan-200/40 focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:border-cyan-300/40"
        />

        {voiceAgent && (
          <div className="flex flex-col items-center justify-end text-xs text-cyan-200/70">
            <button
              type="button"
              onClick={voiceAgent.recording ? voiceAgent.onStop : voiceAgent.onStart}
              disabled={voiceAgent.processing || (!voiceAgent.recording && !voiceAgent.canRecord)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
                voiceAgent.recording
                  ? "bg-rose-500/90 text-white shadow-[0_20px_48px_-24px_rgba(244,63,94,0.65)] hover:bg-rose-500"
                  : "bg-slate-900/80 border border-cyan-500/40 text-cyan-100 shadow-[0_20px_48px_-24px_rgba(14,165,233,0.45)] hover:border-cyan-400"
              )}
            >
              {voiceAgent.processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : voiceAgent.recording ? (
                <PauseCircle className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {voiceAgent.recording ? "Stop" : "Voice"}
            </button>
            {voiceAgent.quota && (
              <span className="mt-1 uppercase tracking-wide text-[0.6rem]" title="Daily voice/text questions used">
                {`${voiceAgent.quota.limit - voiceAgent.quota.remaining}/${voiceAgent.quota.limit}`}
              </span>
            )}
          </div>
        )}
        <Button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="px-6 text-slate-950 font-semibold bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 shadow-[0_18px_45px_-20px_RGBA(34,211,238,0.6)] hover:shadow-[0_25px_65px_-22px_RGBA(34,211,238,0.75)] transition"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};
