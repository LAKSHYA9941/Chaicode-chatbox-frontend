/**
 * useChat Hook - Manages chat state and API interactions
 * Handles message sending, loading states, and error management
 */
import { useState, useCallback } from 'react';
import axios from 'axios';

export const useChat = ({ token, onQuotaChange } = {}) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [quota, setQuota] = useState(null);

  const updateQuota = useCallback(
    (value) => {
      setQuota(value ?? null);
      if (typeof onQuotaChange === 'function') {
        onQuotaChange(value ?? null);
      }
    },
    [onQuotaChange]
  );

  /**
   * Send message to AI and handle response
   */
  const sendMessage = useCallback(async (query, courseId) => {
    if (!query.trim() || isLoading) return;

    // Create user message
    const userMessage = {
      id: Date.now(),
      text: query,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('🤖 Sending message to AI:', { query, course: courseId });

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      const rawApiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const trimmedApiBase = rawApiBase.replace(/\/$/, '');
      const API_BASE_URL = /\/api($|\/)/.test(trimmedApiBase)
        ? trimmedApiBase
        : `${trimmedApiBase}/api`;

      const buildApiUrl = (path) => {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${API_BASE_URL}${normalizedPath}`;
      };

      const { data } = await axios.post(
        buildApiUrl('/ask'),
        {
          query,
          coursename: courseId,
        },
        config
      );

      const botMessage = {
        id: Date.now() + 1,
        text: data.ragAnswer || "I couldn't find an answer to that question. Please try rephrasing or ask something else.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTypingMessageId(botMessage.id);
      setMessages(prev => [...prev, botMessage]);
      updateQuota(data?.quota ?? null);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      const status = error?.response?.status;
      const friendlyMessage = error?.response?.data?.message || error.message || 'Unknown error';
      if (Object.prototype.hasOwnProperty.call(error?.response?.data ?? {}, 'quota')) {
        updateQuota(error.response.data.quota);
      }

      const errorMessage = {
        id: Date.now() + 1,
        text:
          status === 429
            ? friendlyMessage
            : `Sorry, I ran into a hiccup: ${friendlyMessage}. Please try again.`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        meta: { error: true, status },
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, token, updateQuota]);

  const appendMessages = useCallback((incoming = []) => {
    if (!incoming.length) return;
    setMessages(prev => [...prev, ...incoming]);
    setTypingMessageId(null);
  }, []);

  /**
   * Clear messages (when switching courses)
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setTypingMessageId(null);
  }, []);

  /**
   * Handle typing animation completion
   */
  const handleTypingComplete = useCallback(() => {
    setTypingMessageId(null);
  }, []);

  return {
    messages,
    isLoading,
    typingMessageId,
    sendMessage,
    clearMessages,
    handleTypingComplete,
    appendMessages,
    quota,
  };
};
