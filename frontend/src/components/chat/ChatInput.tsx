import { Send } from "lucide-react";
import { useRef, KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

const ChatInput = ({ value, onChange, onSend, disabled }: ChatInputProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput = () => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.min(ref.current.scrollHeight, 150) + "px";
    }
  };

  return (
    <div className="glass top-glow-border border-t border-bmw-blue/10 px-4 md:px-6 py-4 shrink-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={ref}
              value={value}
              onChange={(e) => { onChange(e.target.value); handleInput(); }}
              onKeyDown={handleKeyDown}
              className="w-full bg-foreground/[0.03] border border-bmw-blue/20 rounded-xl px-4 py-3 pr-12 text-sm resize-none transition-all
                focus:outline-none focus:border-bmw-blue focus:shadow-[0_0_0_3px_hsl(var(--bmw-blue)/0.15)] text-foreground placeholder:text-muted-foreground"
              placeholder="Ask about your team..."
              rows={1}
            />
            <button
              onClick={onSend}
              disabled={disabled || !value.trim()}
              className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-bmw-blue hover:bg-bmw-blue-light transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 font-mono text-center">
          Simulations use 8,400+ historical data points • Bias detection enabled
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
