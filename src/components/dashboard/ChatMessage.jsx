/**
 * ChatMessage Component - Individual chat message with typing animation
 * Features: User/bot differentiation, timestamps, typing effects
 * Uses: shadcn/ui components, framer-motion animations
 */
"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { User, Coffee } from "lucide-react";

/**
 * Typing animation component for bot messages
 */
const TypingText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <span>{displayedText}</span>;
};

/**
 * Loading dots animation for when bot is thinking
 */
const LoadingDots = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
  </div>
);

export const ChatMessage = ({ 
  message, 
  isTyping = false, 
  onTypingComplete,
  className 
}) => {
  const isUser = message.sender === 'user';
  
  return (
    <div 
      className={cn(
        "flex animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div className={cn(
        "flex max-w-[72%] items-start space-x-2",
        isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-[0_12px_32px_-20px_rgba(34,211,238,0.7)]",
          isUser
            ? "bg-gradient-to-br from-cyan-500 via-cyan-400 to-cyan-600 text-slate-950"
            : "bg-slate-900/80 border border-cyan-500/30 text-cyan-200"
        )}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Coffee className="w-4 h-4" />
          )}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-2 rounded-2xl transition-shadow",
          isUser
            ? "bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 text-slate-900 shadow-[0_20px_48px_-24px_rgba(34,211,238,0.65)]"
            : "bg-slate-900/75 text-slate-100 border border-cyan-500/25 shadow-[0_22px_60px_-32px_rgba(14,165,233,0.45)] backdrop-blur"
        )}>
          {/* Message Content */}
          {isTyping ? (
            <TypingText
              text={message.text}
              onComplete={onTypingComplete}
            />
          ) : (
            <p className="whitespace-pre-wrap">{message.text}</p>
          )}
          
          {/* Timestamp */}
          <p className={cn(
            "text-[0.7rem] mt-2 tracking-wide uppercase",
            isUser ? "text-slate-900/70" : "text-cyan-200/70"
          )}>
            {message.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Loading message component for when bot is processing
 */
export const LoadingMessage = ({ className }) => (
  <div className={cn(
    "flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
    className
  )}>
    <div className="flex items-start space-x-2">
      <div className="w-9 h-9 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-center text-cyan-200">
        <Coffee className="w-4 h-4" />
      </div>
      <div className="bg-slate-900/70 border border-cyan-500/25 px-4 py-3 rounded-2xl shadow-[0_18px_45px_-28px_rgba(14,165,233,0.45)]">
        <LoadingDots />
      </div>
    </div>
  </div>
);
