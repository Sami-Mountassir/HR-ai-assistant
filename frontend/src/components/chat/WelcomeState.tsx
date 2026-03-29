import { MessageSquare, UserCheck, AlertTriangle, LayoutGrid, Shield } from "lucide-react";

interface WelcomeStateProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { icon: UserCheck, color: "text-teal-spark", text: "Who's ready for promotion?", query: "Who is ready for promotion in Production?" },
  { icon: AlertTriangle, color: "text-danger", text: "Who's at flight risk?", query: "Who is at risk of leaving?" },
  { icon: LayoutGrid, color: "text-bmw-blue-light", text: "Show succession gaps", query: "Show me succession gaps for Leadership roles" },
  { icon: Shield, color: "text-teal-spark", text: "Run fairness check", query: "Run a fairness check on recent promotion decisions" },
];

const WelcomeState = ({ onSuggestion }: WelcomeStateProps) => (
  <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto" style={{ animation: "fadeInUp 0.6s ease" }}>
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bmw-blue to-teal-spark flex items-center justify-center mb-6 shadow-[0_0_40px_hsl(var(--bmw-blue)/0.3)]">
      <MessageSquare className="w-8 h-8 text-foreground" strokeWidth={1.5} />
    </div>
    <h2 className="font-display text-3xl md:text-4xl mb-3 text-foreground italic">How can I help?</h2>
    <p className="text-muted-foreground mb-8 leading-relaxed">
      Ask anything about your team — promotion readiness, retention risk, succession gaps, or run a fairness audit.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
      {suggestions.map((s) => (
        <button
          key={s.query}
          onClick={() => onSuggestion(s.query)}
          className="text-left px-4 py-3 flex items-start gap-3 rounded-lg border border-bmw-blue/20 bg-transparent
            hover:bg-bmw-blue/10 hover:border-bmw-blue transition-all duration-200 group"
        >
          <s.icon className={`w-[18px] h-[18px] ${s.color} shrink-0 mt-0.5`} />
          <span className="text-sm text-foreground">{s.text}</span>
        </button>
      ))}
    </div>
  </div>
);

export default WelcomeState;
