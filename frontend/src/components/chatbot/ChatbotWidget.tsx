import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Minimize2,
  Send,
  Bot,
  User,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    }
    setIsOpen(!isOpen);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleClearMessages = () => {
    clearMessages();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
          "bg-primary/90 hover:bg-primary text-primary-foreground border-2 border-primary/30 backdrop-blur-sm",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Panel - Slides in from right */}
      <div
        className={cn(
          "fixed z-40 transition-all duration-200 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          isMinimized
            ? "bottom-6 right-6 w-16 h-16"
            : "top-0 right-0 w-96 h-full"
        )}
      >
        {/* Backdrop for better visual separation */}
        {!isMinimized && (
          <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent pointer-events-none transition-opacity duration-200" />
        )}

        {/* Main Chat Panel */}
        <div
          className={cn(
            "relative bg-white/95 backdrop-blur-xl shadow-lg transition-opacity duration-200 ease-out",
            "flex flex-col",
            isMinimized
              ? "w-16 h-16 rounded-full border-2 border-primary/20"
              : "w-96 h-full border-l border-l-border/50"
          )}
        >
          {/* Header - Only show when not minimized */}
          {!isMinimized && (
            <div className="flex items-center justify-between border-b border-border/50 p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-sm"></div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-foreground text-lg">
                    AI Assistant
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Powered by AI
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={minimizeChat}
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeChat}
                  className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-[400px] bg-gradient-to-b from-background via-background to-muted/10">
                {messages.length > 1 && (
                  <div className="flex justify-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearMessages}
                      className="text-xs text-muted-foreground hover:text-red-500 hover:border-red-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear Chat
                    </Button>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 transition-all duration-200",
                      message.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!message.isUser && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm shadow-sm transition-all duration-200",
                          message.isUser
                            ? "bg-primary text-white ml-auto rounded-br-md shadow-lg font-medium text-right"
                            : "bg-white/90 backdrop-blur-sm text-foreground border border-border/30 rounded-bl-md shadow-sm hover:shadow-md font-normal text-left"
                        )}
                        style={{
                          maxWidth:
                            message.text.length > 50 ? "85%" : "fit-content",
                          minWidth: "fit-content",
                        }}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap break-normal">
                          {message.text}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-xs text-muted-foreground/70 mt-1",
                          message.isUser ? "text-right mr-2" : "ml-2"
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    {message.isUser && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 transition-all duration-200">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm text-foreground rounded-2xl rounded-bl-md px-4 py-3 text-sm border border-border/30 shadow-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-muted-foreground mr-2">
                          AI is typing
                        </span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                          <div
                            className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border/30 bg-gradient-to-r from-white/80 via-white/90 to-white/80 backdrop-blur-sm p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white/70 backdrop-blur-sm placeholder:text-muted-foreground/60"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="h-10 w-10 bg-primary/90 hover:bg-primary transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Minimized State */}
          {isMinimized && (
            <div
              className="w-full h-full rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-150 shadow-md"
              onClick={maximizeChat}
            >
              <MessageCircle className="h-7 w-7 text-primary-foreground" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatbotWidget;
