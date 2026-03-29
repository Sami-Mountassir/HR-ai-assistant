import { Menu, Shield } from "lucide-react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

const ChatHeader = ({ onToggleSidebar }: ChatHeaderProps) => (
  <header className="glass top-glow-border border-b border-bmw-blue/10 px-4 md:px-6 py-4 flex items-center gap-4 shrink-0"
    style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.01) 2px,rgba(255,255,255,0.01) 4px)" }}>
    <button className="md:hidden p-2 rounded-lg hover:bg-foreground/5" onClick={onToggleSidebar}>
      <Menu className="w-5 h-5 text-foreground" />
    </button>

    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full bg-teal-spark" style={{ boxShadow: "0 0 10px hsl(var(--teal-spark))", animation: "pulse-glow 2s infinite" }} />
      <div>
        <h1 className="font-display text-lg italic text-foreground">BMW AI HR Assistant</h1>
        <p className="text-xs text-muted-foreground font-mono">8,400+ simulations ready</p>
      </div>
    </div>

    <div className="ml-auto flex items-center gap-2">
      <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-spark/10 border border-teal-spark/20 text-xs font-medium text-teal-spark">
        <Shield className="w-3 h-3" />
        Bias Detection Active
      </span>
    </div>
  </header>
);

export default ChatHeader;
