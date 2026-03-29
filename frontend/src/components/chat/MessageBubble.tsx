import { Check, AlertTriangle } from "lucide-react";

export interface AIResponse {
  text: string;
  biasScore?: string;
  candidates?: { name: string; score: number; status: string; note: string; confidence: string }[];
  gaps?: { role: string; coverage: string; status: string; successors: number; note: string }[];
  findings?: { category: string; status: string; detail: string }[];
  nextStep: string;
  simulationCount: string;
}

interface UserBubbleProps {
  content: string;
  animate?: boolean;
}

export const UserBubble = ({ content, animate = false }: UserBubbleProps) => (
  <div className="flex justify-end" style={animate ? { animation: "fadeInUp 0.3s ease" } : undefined}>
    <div className="max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl rounded-br-sm bg-bmw-blue/20 border border-bmw-blue/10">
      <p className="text-sm text-foreground">{content}</p>
    </div>
  </div>
);

interface AIBubbleProps {
  response: AIResponse;
  animate?: boolean;
}

const statusColor = (status: string) => {
  if (["ready", "readiness", "strong", "pass"].includes(status)) return "text-teal-spark";
  if (["high-risk", "critical", "warning"].includes(status)) return "text-danger";
  return "text-bmw-blue-light";
};

const statusBg = (status: string) => {
  if (["ready", "readiness", "strong"].includes(status)) return "bg-teal-spark/10 border-teal-spark/20";
  if (["high-risk", "critical"].includes(status)) return "bg-danger/10 border-danger/20";
  return "bg-bmw-blue/10 border-bmw-blue/20";
};

export const AIBubble = ({ response, animate = false }: AIBubbleProps) => (
  <div className="flex justify-start" style={animate ? { animation: "fadeInUp 0.4s ease" } : undefined}>
    <div className="max-w-[90%] md:max-w-[75%] px-5 py-4 rounded-2xl rounded-bl-sm bg-gradient-to-br from-bmw-blue/8 to-teal-spark/4 border border-bmw-blue/15">
      <p className="text-sm mb-4 text-foreground">
        {response.text}
        {response.biasScore && <span className="text-teal-spark font-semibold ml-1">{response.biasScore}</span>}
      </p>

      {/* Candidates */}
      {response.candidates && (
        <div className="space-y-2.5">
          {response.candidates.map((c) => (
            <div key={c.name} className={`flex items-start gap-3 p-3 rounded-xl border ${statusBg(c.status)}`}>
              <div className={`text-2xl font-display ${statusColor(c.status)}`}>{c.score}%</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${statusColor(c.status)}`}>
                    {c.confidence} confidence
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gaps */}
      {response.gaps && (
        <div className="space-y-2.5">
          {response.gaps.map((g) => (
            <div key={g.role} className={`flex items-start gap-3 p-3 rounded-xl border ${statusBg(g.status)}`}>
              <div className={`text-lg font-display ${statusColor(g.status)}`}>{g.coverage}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{g.role}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider ${statusColor(g.status)} bg-foreground/5`}>
                    {g.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{g.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Findings */}
      {response.findings && (
        <div className="space-y-2">
          {response.findings.map((f) => (
            <div key={f.category} className={`flex items-start gap-3 p-3 rounded-xl border ${f.status === "pass" ? "bg-teal-spark/5 border-teal-spark/15" : "bg-danger/5 border-danger/15"}`}>
              {f.status === "pass" ? (
                <Check className="w-4 h-4 text-teal-spark shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-medium text-sm text-foreground">{f.category}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Next step */}
      <div className="mt-4 pt-3 border-t border-foreground/5">
        <p className="text-xs font-medium">
          <span className="text-muted-foreground">Next step: </span>
          <span className="text-teal-spark">{response.nextStep} →</span>
        </p>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 font-mono">
        Based on {response.simulationCount} simulations
      </p>
    </div>
  </div>
);
