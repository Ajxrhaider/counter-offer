"use client";

import { Send, User, Bot, Briefcase } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) throw new Error("Failed to connect to the Hiring Manager.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      const assistantId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: assistantMessage } : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen w-full bg-[#0f172a] text-[#e5e7eb] font-inter selection:bg-[#b3d4fc] selection:text-black overflow-hidden relative">
      
      {/* Hizaki Labs Glassmorphism Header */}
      <header className="bg-[#1e293b]/80 shadow-sm py-4 sticky top-0 z-50 backdrop-blur-md border-b border-[#6366f1]/20">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-4xl">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#6366f1] font-spaceGrotesk tracking-wide">
              Hizaki Labs
            </h1>
            <span className="hidden md:inline-block w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="hidden md:inline-block text-sm text-[#e5e7eb]/70 font-medium ml-1">Negotiation Engine</span>
          </div>
          <a href="#" className="text-sm font-semibold text-[#e5e7eb] hover:text-[#6366f1] transition-colors duration-300">
            Exit Interview &times;
          </a>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth container mx-auto max-w-4xl custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up">
            <div className="text-5xl text-[#6366f1] mb-6 drop-shadow-lg">
              <Briefcase size={64} />
            </div>
            {/* Styled Section Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-[#e5e7eb] font-spaceGrotesk relative pb-6 mb-4">
              Secure The Offer
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#6366f1] rounded"></span>
            </h2>
            <p className="text-lg text-[#e5e7eb]/80 max-w-xl leading-relaxed mb-8">
              You are officially holding a starting offer for <strong className="text-[#10b981]">$100,000</strong>. Your goal is <strong className="text-[#10b981]">$120,000</strong>. Make your case to the Hiring Manager below.
            </p>
          </div>
        )}
        
        {messages.map((message) => {
          const isUser = message.role === "user";
          const isGrading = message.content.includes("[NEGOTIATION ENDED]");
          
          return (
            <div 
              key={message.id} 
              className={`flex gap-4 animate-fade-in-up ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transform transition-transform duration-300 hover:scale-110 ${
                isUser ? "bg-[#4f46e5] text-white" : 
                isGrading ? "bg-[#10b981] text-white" : "bg-[#1e293b] border-2 border-[#6366f1] text-[#6366f1]"
              }`}>
                {isUser ? <User size={24} /> : <Bot size={24} />}
              </div>

              {/* Chat Bubble mimicking Hizaki Labs cards */}
              <div className={`max-w-[85%] md:max-w-[75%] p-5 md:p-6 rounded-xl shadow-lg transition-all duration-300 ${
                isUser ? "bg-[#6366f1] text-white rounded-tr-sm hover:shadow-2xl" : 
                isGrading ? "bg-[#1e293b] border-l-4 border-[#10b981] text-[#e5e7eb] rounded-tl-sm" :
                "bg-[#1e293b] border border-[#6366f1]/20 text-[#e5e7eb] rounded-tl-sm hover:border-[#6366f1]/50"
              }`}>
                {isGrading ? (
                  <div className="space-y-3">
                    <p className="text-sm font-bold font-spaceGrotesk tracking-widest text-[#10b981] uppercase">SYSTEM OVERRIDE // GRADING</p>
                    <div className="w-full h-[1px] bg-[#10b981]/30 my-2"></div>
                    <div className="whitespace-pre-wrap leading-relaxed text-[#e5e7eb]/90">
                      {message.content.replace("[NEGOTIATION ENDED]", "").trim()}
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area Form */}
      <div className="bg-[#1e293b] border-t border-[#6366f1]/20 py-4 px-4 md:px-0 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              className="w-full px-4 py-4 md:py-5 pl-5 pr-16 bg-[#0f172a] border-2 border-[#6366f1]/30 rounded-xl text-[#e5e7eb] placeholder-[#e5e7eb]/40 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all font-inter shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Formulate your counter-offer..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-3 bg-[#6366f1] text-white rounded-lg font-semibold hover:bg-[#4f46e5] transition-colors transform hover:-translate-y-1 duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-[#6366f1]"
              aria-label="Send Message"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <Send size={22} />}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-xs text-[#e5e7eb]/40 font-medium tracking-wide">
              Hizaki Labs AI Engine &bull; Be concise and professional.
            </p>
          </div>
        </div>
      </div>
      
      {/* Global CSS for Custom Scrollbar matching main.css */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </main>
  );
}