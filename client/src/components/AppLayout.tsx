import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Home, CreditCard, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout Component
 * Provides mobile bottom navigation and desktop sidebar
 * Mobile-first responsive design
 */
export default function AppLayout({ children }: AppLayoutProps) {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation()[0];

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/loans", label: "Loans", icon: CreditCard },
    { path: "/profile", label: "Profile", icon: User }
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-slate-200">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/logo-dark.svg" 
              alt="Goodleaf" 
              className="h-10"
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-slate-200">
          <button
            onClick={() => setLocation("/login")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 h-14">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <img 
            src="/logo-dark.svg" 
            alt="Goodleaf" 
            className="h-8"
          />
          <div className="w-10"></div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform md:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b border-slate-200 mt-14">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/logo-dark.svg" 
              alt="Goodleaf" 
              className="h-10"
            />
          </button>
        </div>

        <nav className="p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-white">
          <button
            onClick={() => {
              setLocation("/login");
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pt-14 md:pt-0 pb-20 md:pb-0">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                    active
                      ? "text-primary"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}
