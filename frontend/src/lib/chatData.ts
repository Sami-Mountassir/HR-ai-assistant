import type { AIResponse } from "@/components/chat/MessageBubble";

export const aiResponses: Record<string, AIResponse> = {
  promotion: {
    text: "Based on 8,400+ simulations across performance, potential, and readiness factors, here are your top candidates:",
    candidates: [
      { name: "Anna K.", score: 87, status: "readiness", note: "Leadership training recommended", confidence: "high" },
      { name: "Marcus L.", score: 79, status: "partial", note: "Strong technical, needs soft skills", confidence: "medium" },
      { name: "Sophie R.", score: 92, status: "ready", note: "Immediate promotion viable, low flight risk", confidence: "high" },
    ],
    nextStep: "Schedule calibration meeting with department heads",
    simulationCount: "8,400+",
  },
  firing: {
    text: "Termination impact analysis complete. Here is the full assessment of the employee across performance, team dependency, legal risk, and replacement cost:",
    candidates: [
      { name: "Employee Profile", score: 42, status: "high-risk", note: "Performance: Below average · 2 PIPs in last 12 months · Team dependency: Low", confidence: "high" },
      { name: "Financial Impact", score: 68, status: "partial", note: "Severance est: $45K · Replacement cost: $32K · Net annual savings: $89K", confidence: "high" },
      { name: "Risk Assessment", score: 35, status: "high-risk", note: "Legal risk: Low · Knowledge transfer: 2-3 weeks · Team morale impact: Minimal", confidence: "medium" },
    ],
    nextStep: "Schedule review with Legal and HR before proceeding with termination",
    simulationCount: "6,200+",
  },
  retention: {
    text: "I've identified 3 team members with elevated flight risk based on engagement patterns, market demand, and career trajectory simulations:",
    candidates: [
      { name: "Thomas B.", score: 78, status: "high-risk", note: "12+ months without growth opportunity", confidence: "high" },
      { name: "Lisa M.", score: 65, status: "medium-risk", note: "Compensation below market (14%)", confidence: "medium" },
      { name: "James W.", score: 54, status: "watch", note: "Recently declined leadership offer", confidence: "medium" },
    ],
    nextStep: "Schedule retention conversations within 2 weeks",
    simulationCount: "6,200+",
  },
  succession: {
    text: "Succession coverage analysis for Leadership roles (Director+):",
    gaps: [
      { role: "VP Engineering", coverage: "45%", status: "critical", successors: 1, note: "Only 1 ready-now candidate" },
      { role: "Director of Operations", coverage: "72%", status: "adequate", successors: 2, note: "1 ready-now, 1 ready-in-1-year" },
      { role: "Head of Product", coverage: "88%", status: "strong", successors: 3, note: "Multiple succession paths" },
    ],
    nextStep: "Review VP Engineering succession plan with CHRO",
    simulationCount: "4,100+",
  },
  fairness: {
    text: "Fairness audit complete for Q4 promotion cycle. Overall bias score: ",
    biasScore: "8.4/10",
    findings: [
      { category: "Gender parity", status: "pass", detail: "52% female promotions vs. 48% workforce (within tolerance)" },
      { category: "Age distribution", status: "pass", detail: "Normal distribution across age bands" },
      { category: "Tenure bias", status: "warning", detail: "Candidates with <2 years tenure 23% less likely to be promoted" },
    ],
    nextStep: "Review tenure bias finding with HR committee",
    simulationCount: "12,800+",
  },
  "cost-reduction": {
    text: "Cost reduction analysis complete. Based on salary data, performance metrics, and organizational impact, here are the top 3 recommended separations to meet your budget target:",
    candidates: [
      { name: "Oliver Weber", score: 34, status: "high-risk", note: "Salary: $142K · Performance: Below avg · Dept overlap: 78% — minimal operational impact", confidence: "high" },
      { name: "Felix Braun", score: 41, status: "high-risk", note: "Salary: $118K · Performance: Avg · Role redundancy detected — functions covered by team", confidence: "high" },
      { name: "Julia Schneider", score: 52, status: "medium-risk", note: "Salary: $95K · Performance: Avg · Transitional role — can be absorbed by adjacent team", confidence: "medium" },
    ],
    nextStep: "Total projected savings: $355K/yr · Schedule workforce planning review with Finance and Legal",
    simulationCount: "9,200+",
  },
  "cv-evaluation": {
    text: "CV evaluation complete. Candidates ranked by overall fit score across technical skills, experience depth, cultural alignment, and growth potential:",
    candidates: [
      { name: "Candidate A — Sarah Chen", score: 94, status: "ready", note: "★ Top Pick · 7yr React/TS · Led 12-person team · Strong system design · Culture: Excellent", confidence: "high" },
      { name: "Candidate B — James Park", score: 81, status: "readiness", note: "5yr experience · Solid fundamentals · Missing leadership exposure · High growth potential", confidence: "high" },
      { name: "Candidate C — Maria Lopez", score: 67, status: "partial", note: "3yr experience · Strong portfolio · Gaps in backend/infra · Would need mentoring", confidence: "medium" },
    ],
    nextStep: "Recommend proceeding with Candidate A (Sarah Chen) for final interview round. Schedule technical deep-dive for Candidate B as backup",
    simulationCount: "5,600+",
  },
  default: {
    text: "I've analyzed your request across multiple simulation models. Here's what I found:",
    candidates: [
      { name: "Analysis Complete", score: 85, status: "ready", note: "Results compiled from team data", confidence: "high" },
    ],
    nextStep: "Would you like me to dive deeper into any specific area?",
    simulationCount: "8,400+",
  },
};

export function detectResponseType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("promotion") || lower.includes("ready")) return "promotion";
  if (lower.includes("risk") || lower.includes("leaving") || lower.includes("retention")) return "retention";
  if (lower.includes("succession") || lower.includes("gap")) return "succession";
  if (lower.includes("fairness") || lower.includes("bias") || lower.includes("audit")) return "fairness";
  if (lower.includes("cv") || lower.includes("candidate") || lower.includes("resume")) return "cv-evaluation";
  if (lower.includes("fire") || lower.includes("firing") || lower.includes("terminate")) return "firing";
  return "default";
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export const mockChats: Record<string, ChatMessage[]> = {
  promotion: [
    { role: "user", content: "Who in Production is ready for promotion next quarter?" },
    { role: "ai", content: "promotion" },
  ],
  retention: [
    { role: "user", content: "Who in Engineering is at risk of leaving in the next 6 months?" },
    { role: "ai", content: "retention" },
  ],
  succession: [
    { role: "user", content: "Show me succession gaps for Leadership roles" },
    { role: "ai", content: "succession" },
  ],
  fairness: [
    { role: "user", content: "Run a fairness check on Q4 promotion decisions" },
    { role: "ai", content: "fairness" },
  ],
};
