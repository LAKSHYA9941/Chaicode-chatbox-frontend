/**
 * ChatArea Component - Main chat interface container
 * Handles message display, welcome screen, and scroll management
 */
"use client";
import React, { useRef, useEffect } from "react";
import { ChatMessage, LoadingMessage } from "./ChatMessage";
import WelcomeScreen from "./WelcomeScreen";

export const ChatArea = ({ 
  messages, 
  isLoading, 
  typingMessageId, 
  selectedCourse, 
  onExampleClick, 
  onTypingComplete 
}) => {
  const messagesEndRef = useRef(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 min-h-full overflow-y-auto p-2 border-l border-cyan-500/10 shadow-[inset_0_0_140px_rgba(14,165,233,0.12)]">
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {/* Welcome Screen or Messages */}
        {messages.length === 0 ? (
          <WelcomeScreen
            selectedCourse={selectedCourse}
            onExampleClick={onExampleClick}
          />
        ) : (
          <>
            {/* Message List */}
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isTyping={typingMessageId === message.id}
                onTypingComplete={onTypingComplete}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && <LoadingMessage />}
          </>
        )}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
