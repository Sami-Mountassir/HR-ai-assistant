import { NavLink, useLocation } from "react-router-dom";
import { Home, MessageSquare, Layers, LayoutDashboard } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "AI Assistant", icon: MessageSquare },
];

const DashboardNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/10 top-glow-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Layers className="w-4 h-4 text-foreground" />
          </div>
          <span className="font-display text-base italic text-foreground hidden sm:inline">Leadership OS</span>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-primary/12 text-foreground border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-foreground">
            MK
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
