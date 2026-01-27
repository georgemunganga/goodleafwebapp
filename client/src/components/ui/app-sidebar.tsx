import { Home, FileText, User, Calculator, CreditCard, LogOut, Settings, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  placeholder?: boolean;
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "My Loans", path: "/loans" },
  { icon: CreditCard, label: "Apply for Loan", path: "/apply" },
  { icon: Calculator, label: "Check Eligibility", path: "/check-eligibility" },
];

const secondaryNavItems: NavItem[] = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Help & Support", path: "/help" },
];

export function AppSidebar() {
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location === "/dashboard" || location === "/";
    }
    return location.startsWith(path);
  };

  const handleNavClick = (item: NavItem) => {
    if (item.placeholder) {
      toast.info("Feature coming soon");
      return;
    }
    navigate(item.path);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src="/images/logo-dark.svg" alt="Goodleaf" className="h-8" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
          Main Menu
        </p>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                active
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
            Account
          </p>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  active
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
