import { useState, useCallback, useEffect } from "react";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

const STORAGE_KEY = "chatbot-messages";

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage on initialization
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.warn("Failed to load chat messages from localStorage:", error);
    }

    // Return default welcome message
    return [
      {
        id: "1",
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn("Failed to save chat messages to localStorage:", error);
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log("Sending message to backend:", text.trim());

      // Get backend URL from environment variables
      const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
      if (!backendUrl) {
        throw new Error(
          "Backend URL not configured. Please set VITE_BACKEND_BASE_URL in your .env file."
        );
      }

      // Call your backend chat endpoint
      const response = await fetch(`${backendUrl}/projects/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: text.trim(),
      });

      console.log("Backend response status:", response.status);
      console.log("Backend response headers:", response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log("Backend response data:", data);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Chat error details:", error);

      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to the server. Please check if the backend is running.";
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
