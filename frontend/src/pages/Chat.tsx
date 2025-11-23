import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send, Loader } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      text: "שלום! אני כאן כדי לעזור לך לנהל את המשקיעים שלך. תשאלי אותי כל שאלה בעברית!",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // --- FIXED: no JSON body, only query parameter ---
      const response = await fetch(
        `http://127.0.0.1:8000/api/chat?message=${encodeURIComponent(
          userMessage.text
        )}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        text: data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        text: "❌ קרתה שגיאה. בואי ננסה שוב.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#F8F9FB] to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm text-right">
        <h1 className="text-2xl font-bold text-[#1A2B4A]">💬 AI Chat</h1>
        <p className="text-sm text-[#717182]">שאלי אותי על המשקיעים שלך</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.type === "user"
                  ? "bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white rounded-bl-3xl"
                  : "bg-gray-100 text-[#1A2B4A] rounded-br-3xl"
              }`}
            >
              <p className="text-sm leading-relaxed text-right">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.type === "user"
                    ? "text-blue-100"
                    : "text-[#717182]"
                } text-left`}
              >
                {message.timestamp.toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-[#1A2B4A] px-4 py-3 rounded-lg rounded-br-3xl">
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm">מחשב...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="שאלי משהו..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 bg-[#F8F9FB] border-transparent focus:border-[#2F80ED] text-right"
            dir="rtl"
          />

          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
