import { ReactNode, useMemo } from "react";
import { useLocation } from "wouter";
import { Home, CreditCard, User, LogOut, Calculator, FileText, Settings, HelpCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useNotificationBadges } from "@/hooks/useNotificationBadges";
import { useUserLoans } from "@/hooks/useLoanQueries";
import { useLoanApplicationGate } from "@/hooks/useLoanApplicationGate";
import { useAuthContext } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout Component
 * Mobile-first design matching industry banking apps
 * - Floating green bottom nav on mobile (no sidebar)
 * - Desktop sidebar navigation
 * - Native app feel on mobile
 * - Notification badges for high-priority actions
 */
export default function AppLayout({ children }: AppLayoutProps) {
  const [location, setLocation] = useLocation();
  const { data: loans = [] } = useUserLoans();
  const badges = useNotificationBadges(loans);
  const { canApply, inProgressLoan } = useLoanApplicationGate();
  const { logout } = useAuthContext();

  // Conditionally show "Apply for Loan" or "Application Status" based on user's loan status
  const mainNavItems = useMemo(() => {
    const baseItems = [
      { path: "/dashboard", label: "Dashboard", icon: Home },
      { path: "/loans", label: "My Loans", icon: FileText },
    ];

    // If user has an in-progress loan, show "Application Status" instead of "Apply"
    if (!canApply && inProgressLoan) {
      baseItems.push({
        path: `/loans/${inProgressLoan.loanId}`,
        label: "Application Status",
        icon: Clock,
      });
    } else {
      baseItems.push({
        path: "/apply",
        label: "Apply for Loan",
        icon: CreditCard,
      });
    }

    baseItems.push({ path: "/check-eligibility", label: "Check Eligibility", icon: Calculator });

    return baseItems;
  }, [canApply, inProgressLoan]);

  const secondaryNavItems = [
    { path: "/profile", label: "Profile", icon: User },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/help", label: "Help & Support", icon: HelpCircle },
  ];

  const mobileNavItems = [
    { path: "/dashboard", label: "Home", icon: Home, badge: badges.dashboardBadge },
    { path: "/loans", label: "Loans", icon: FileText, badge: badges.loansBadge },
    { path: "/profile", label: "Profile", icon: User, badge: badges.profileBadge }
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
              const badgeCount = item.path === "/dashboard" ? badges.dashboardBadge : item.path === "/loans" ? badges.loansBadge : 0;
              const showBadge = badgeCount > 0;
              const badgeText = badgeCount > 9 ? "9+" : String(badgeCount);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative ${
                    active
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {showBadge && (
                    <span className={`ml-auto flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-bold rounded-full ${
                      active ? "bg-white text-primary" : "bg-red-500 text-white"
                    }`}>
                      {badgeText}
                    </span>
                  )}
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
                const badgeCount = item.path === "/profile" ? badges.profileBadge : 0;
                const showBadge = badgeCount > 0;
                const badgeText = badgeCount > 9 ? "9+" : String(badgeCount);

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path, item.placeholder)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative ${
                      active
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {showBadge && (
                      <span className={`ml-auto flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-bold rounded-full ${
                        active ? "bg-white text-primary" : "bg-red-500 text-white"
                      }`}>
                        {badgeText}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              logout();
              setLocation("/login");
            }}
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
              const badgeCount = item.badge ?? 0;
              const showBadge = badgeCount > 0;
              const badgeText = badgeCount > 9 ? "9+" : String(badgeCount);

              return (
                <button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${
                    active
                      ? "text-white"
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all relative ${active ? "bg-white/20" : ""}`}>
                    <Icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-primary">
                        {badgeText}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? "opacity-100" : "opacity-70"}`}>
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
