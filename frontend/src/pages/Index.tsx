import { useState, useRef, useEffect, useCallback } from "react";
import AmbientBackground from "@/components/chat/AmbientBackground";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import WelcomeState from "@/components/chat/WelcomeState";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { UserBubble, AIBubble } from "@/components/chat/MessageBubble";
import NewSimulationModal from "@/components/chat/NewSimulationModal";
import type { SimulationType } from "@/components/chat/NewSimulationModal";
import { aiResponses, detectResponseType, mockChats, type ChatMessage } from "@/lib/chatData";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>("promotion");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [simModalOpen, setSimModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const loadChat = (chatId: string) => {
    const chat = mockChats[chatId];
    if (!chat) return;
    setActiveChat(chatId);
    setShowWelcome(false);
    setMessages([...chat]);
    setSidebarOpen(false);
  };

  const startNewChat = () => {
    setActiveChat(null);
    setShowWelcome(true);
    setMessages([]);
    setInputValue("");
    setSidebarOpen(false);
    setSimModalOpen(true);
  };

  const handleRunSimulation = (type: SimulationType, data: Record<string, string>) => {
    setSimModalOpen(false);
    setShowWelcome(false);

    const labels: Record<SimulationType, string> = {
      promotion: `Run promotion readiness analysis${data.name ? ` for ${data.name}` : ""}${data.role ? ` → ${data.role}` : ""}`,
      firing: `Analyse firing decision${data.name ? ` for ${data.name}` : ""}`,
      "cost-reduction": `Run cost reduction analysis${data.budget ? ` with $${data.budget} target` : ""}`,
      "cv-evaluation": `Evaluate ${data.cvCount || ""} candidate CVs${data.jobPosition ? ` for ${data.jobPosition}` : ""}`,
    };

    const userMsg = labels[type] || `Run ${type} simulation`;
    setMessages([{ role: "user", content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", content: type }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const sendMessage = (text?: string) => {
    const msg = (text || inputValue).trim();
    if (!msg || isTyping) return;

    setShowWelcome(false);
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const responseType = detectResponseType(msg);
      setMessages((prev) => [...prev, { role: "ai", content: responseType }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const quickQuery = (team: string) => {
    setInputValue(`Tell me about the ${team}`);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen relative">
      <AmbientBackground />

      <ChatSidebar
        isOpen={sidebarOpen}
        activeChat={activeChat}
        onNewChat={startNewChat}
        onLoadChat={loadChat}
        onQuickQuery={quickQuery}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full relative z-10">
        <ChatHeader onToggleSidebar={() => setSidebarOpen((p) => !p)} />

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          {showWelcome ? (
            <WelcomeState onSuggestion={(text) => sendMessage(text)} />
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <UserBubble key={i} content={msg.content} />
                ) : (
                  <AIBubble key={i} response={aiResponses[msg.content] || aiResponses.default} />
                )
              )}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => sendMessage()}
          disabled={isTyping}
        />
      </main>

      <NewSimulationModal
        open={simModalOpen}
        onOpenChange={setSimModalOpen}
        onRunSimulation={handleRunSimulation}
      />
    </div>
  );
};

export default Index;
