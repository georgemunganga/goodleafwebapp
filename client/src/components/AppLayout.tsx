import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Home, CreditCard, User, LogOut, Calculator, FileText, Settings, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout Component
 * Mobile-first design matching industry banking apps
 * - Floating green bottom nav on mobile (no sidebar)
 * - Desktop sidebar navigation
 * - Native app feel on mobile
 */
export default function AppLayout({ children }: AppLayoutProps) {
  const [location, setLocation] = useLocation();

  const mainNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/loans", label: "My Loans", icon: FileText },
    { path: "/apply", label: "Apply for Loan", icon: CreditCard },
    { path: "/check-eligibility", label: "Check Eligibility", icon: Calculator },
  ];

  const secondaryNavItems = [
    { path: "/profile", label: "Profile", icon: User },
    { path: "/settings", label: "Settings", icon: Settings, placeholder: true },
    { path: "/help", label: "Help & Support", icon: HelpCircle, placeholder: true },
  ];

  const mobileNavItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/loans", label: "Loans", icon: FileText },
    { path: "/profile", label: "Profile", icon: User }
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") return location === path || location === "/";
    if (path === "/loans") return location.startsWith("/loans");
    return location === path;
  };

  const handleNavClick = (path: string, placeholder?: boolean) => {
    if (placeholder) {
      toast.info("Feature coming soon");
      return;
    }
    setLocation(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/images/logo-dark.svg" 
              alt="Goodleaf" 
              className="h-8"
            />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    active
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-3">
              Account
            </p>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path, item.placeholder)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                      active
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setLocation("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Content Area - Extra padding at bottom for mobile nav */}
        <div className="min-h-screen pb-24 lg:pb-8">
          {children}
        </div>

        {/* Mobile Floating Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-primary rounded-2xl shadow-xl shadow-primary/30 z-50">
          <div className="flex items-center justify-around h-16">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all ${
                    active
                      ? "text-white"
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-white/20" : ""}`}>
                    <Icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} />
                  </div>
                  <span className={`text-[10px] font-semibold ${active ? "opacity-100" : "opacity-70"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}
