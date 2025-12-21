import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { Lock, Bell, LogOut, ChevronRight, User, Shield, HelpCircle, FileText } from "lucide-react";
import { useState } from "react";

/**
 * Profile Page
 * Design: Mobile-native banking app style
 * - User info header
 * - Settings menu list
 * - Quick actions
 */
export default function Profile() {
  const [, setLocation] = useLocation();

  const profile = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+260 123 456 789"
  };

  const menuItems = [
    {
      icon: User,
      label: "Personal Details",
      description: "Name, email, phone",
      action: () => {}
    },
    {
      icon: Lock,
      label: "Change PIN",
      description: "Update your login PIN",
      action: () => {}
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Payment reminders, alerts",
      action: () => {}
    },
    {
      icon: Shield,
      label: "Security",
      description: "2FA, active sessions",
      action: () => {}
    },
    {
      icon: FileText,
      label: "Documents",
      description: "KYC, uploaded files",
      action: () => {}
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQs, contact us",
      action: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-primary pt-safe">
        <div className="px-5 pt-6 pb-8">
          <h1 className="text-white font-bold text-lg text-center mb-6">Profile</h1>
          
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-white">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </span>
            </div>
            <h2 className="text-white font-bold text-lg">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-white/70 text-sm">{profile.email}</p>
            <p className="text-white/70 text-sm">{profile.phone}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 -mt-2 pb-8">
        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-4 p-4 text-left active:bg-slate-50 transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 mb-4">Goodleaf Loans v1.0.0</p>
          
          {/* Logout Button */}
          <Button
            onClick={() => setLocation("/login")}
            variant="outline"
            className="w-full rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold h-12"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Legal Links */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="text-xs text-slate-500">Terms of Service</button>
          <span className="text-slate-300">•</span>
          <button className="text-xs text-slate-500">Privacy Policy</button>
        </div>
      </main>
    </div>
  );
}
