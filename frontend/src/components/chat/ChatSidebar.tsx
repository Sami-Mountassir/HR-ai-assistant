import { Plus, Settings, Layers } from "lucide-react";

interface ChatSidebarProps {
  isOpen: boolean;
  activeChat: string | null;
  onNewChat: () => void;
  onLoadChat: (id: string) => void;
  onQuickQuery: (team: string) => void;
  onClose: () => void;
}

const recentSimulations = [
  { id: "promotion", title: "Promotion Readiness", subtitle: "Production Team • 2m ago" },
  { id: "retention", title: "Retention Risk Analysis", subtitle: "Engineering • 1h ago" },
  { id: "succession", title: "Succession Planning", subtitle: "Leadership • 3h ago" },
  { id: "fairness", title: "Fairness Audit", subtitle: "Q4 Promotions • Yesterday" },
];

const quickAccess = [
  { label: "Production Team", abbr: "PT", color: "bg-bmw-blue/15" },
  { label: "Engineering", abbr: "EN", color: "bg-teal-spark/15" },
  { label: "Leadership", abbr: "LD", color: "bg-bmw-blue/15" },
];

const ChatSidebar = ({ isOpen, activeChat, onNewChat, onLoadChat, onQuickQuery, onClose }: ChatSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[90] md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`w-72 h-full glass border-r border-bmw-blue/15 flex flex-col relative z-20 shrink-0
          fixed md:relative left-0 top-0 bottom-0 transition-transform duration-300 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"} z-[100] md:z-20`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-foreground/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-bmw-blue to-teal-spark flex items-center justify-center">
              <Layers className="w-[18px] h-[18px] text-foreground" />
            </div>
            <span className="font-display text-lg italic text-foreground">Leadership OS</span>
          </div>
        </div>

        {/* New Simulation */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-bmw-blue to-bmw-blue-light 
              text-foreground font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 
              hover:-translate-y-0.5 hover:shadow-[0_8px_30px_hsl(var(--bmw-blue)/0.3)]"
          >
            <Plus className="w-4 h-4" />
            New Simulation
          </button>
        </div>

        {/* Recent Simulations */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
              Recent Simulations
            </p>
            <div className="space-y-1">
              {recentSimulations.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => onLoadChat(sim.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 border-l-2
                    ${activeChat === sim.id
                      ? "bg-bmw-blue/12 border-l-teal-spark"
                      : "border-l-transparent hover:bg-bmw-blue/8 hover:border-l-bmw-blue"
                    }`}
                >
                  <p className="text-sm font-medium truncate text-foreground">{sim.title}</p>
                  <p className="text-xs text-muted-foreground">{sim.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div className="px-3 py-4 mt-2 border-t border-foreground/5">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
              Quick Access
            </p>
            <div className="space-y-1">
              {quickAccess.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onQuickQuery(item.label)}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all duration-200 border-l-2 border-l-transparent hover:bg-bmw-blue/8 hover:border-l-bmw-blue"
                >
                  <div className={`w-7 h-7 rounded ${item.color} flex items-center justify-center text-xs font-medium text-foreground`}>
                    {item.abbr}
                  </div>
                  <span className="text-sm text-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-foreground/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bmw-blue to-teal-spark flex items-center justify-center text-sm font-semibold text-foreground">
              MK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">Maria Krauss</p>
              <p className="text-xs text-muted-foreground">HR Director</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-foreground/5 transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
