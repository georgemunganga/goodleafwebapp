import { Home, FileText, User } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: FileText, label: "Loans", path: "/loans" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location === "/dashboard" || location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-primary rounded-2xl shadow-lg shadow-primary/30 z-50 lg:hidden">
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200",
                active ? "text-white" : "text-white/60 hover:text-white/80"
              )}
            >
              <Icon className={cn("w-6 h-6", active && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
