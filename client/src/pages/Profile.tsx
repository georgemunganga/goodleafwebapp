import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeft, Lock, Bell, LogOut, Edit2, Save } from "lucide-react";
import { useState } from "react";

/**
 * Profile Page
 * Design: Mobile-first responsive with modern branding
 * - Personal details
 * - Security settings
 * - Notification preferences
 * - Support tickets
 */
export default function Profile() {
  const [, setLocation] = useLocation();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "security" | "notifications">("personal");

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+260 123 456 789"
  });

  const [notifications, setNotifications] = useState({
    paymentReminders: true,
    statusUpdates: true,
    marketing: false,
    smsNotifications: true,
    emailNotifications: true
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string) => {
    setNotifications(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof notifications]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container flex items-center justify-between h-14 md:h-20 px-4 md:px-6">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6 text-slate-900" />
            <span className="text-sm md:text-base font-semibold text-slate-900">Back</span>
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-slate-900">Profile</h1>
          <div className="w-8 h-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 md:px-6 py-6 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8 md:mb-12 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl md:text-4xl font-bold text-primary">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              {profile.email}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 border-b border-slate-200 overflow-x-auto">
            {[
              { id: "personal", label: "Personal Details", icon: "👤" },
              { id: "security", label: "Security", icon: "🔒" },
              { id: "notifications", label: "Notifications", icon: "🔔" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 md:px-6 py-3 md:py-4 border-b-2 font-semibold text-xs md:text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Personal Details Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in">
              <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900">
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    {isEditingProfile ? (
                      <Save className="w-5 h-5 text-primary" />
                    ) : (
                      <Edit2 className="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        First Name
                      </label>
                      <Input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => handleProfileChange("firstName", e.target.value)}
                        disabled={!isEditingProfile}
                        className="h-10 md:h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 disabled:bg-slate-50 text-sm md:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => handleProfileChange("lastName", e.target.value)}
                        disabled={!isEditingProfile}
                        className="h-10 md:h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 disabled:bg-slate-50 text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      disabled={!isEditingProfile}
                      className="h-10 md:h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 disabled:bg-slate-50 text-sm md:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      disabled={!isEditingProfile}
                      className="h-10 md:h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 disabled:bg-slate-50 text-sm md:text-base"
                    />
                  </div>

                  {isEditingProfile && (
                    <Button
                      onClick={() => setIsEditingProfile(false)}
                      className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in">
              <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 md:w-6 md:h-6" />
                  Security Settings
                </h3>

                <div className="space-y-4 md:space-y-6">
                  <button className="w-full p-4 md:p-6 border-2 border-slate-200 rounded-2xl md:rounded-3xl hover:border-primary/30 hover:bg-slate-50 transition-all text-left group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm md:text-base mb-1">
                          Change PIN
                        </h4>
                        <p className="text-xs md:text-sm text-slate-600">
                          Update your login PIN
                        </p>
                      </div>
                      <span className="text-primary font-semibold text-sm md:text-base group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </button>

                  <button className="w-full p-4 md:p-6 border-2 border-slate-200 rounded-2xl md:rounded-3xl hover:border-primary/30 hover:bg-slate-50 transition-all text-left group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm md:text-base mb-1">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-xs md:text-sm text-slate-600">
                          Add an extra layer of security
                        </p>
                      </div>
                      <span className="text-primary font-semibold text-sm md:text-base group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </button>

                  <button className="w-full p-4 md:p-6 border-2 border-slate-200 rounded-2xl md:rounded-3xl hover:border-primary/30 hover:bg-slate-50 transition-all text-left group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm md:text-base mb-1">
                          Active Sessions
                        </h4>
                        <p className="text-xs md:text-sm text-slate-600">
                          Manage your login sessions
                        </p>
                      </div>
                      <span className="text-primary font-semibold text-sm md:text-base group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in">
              <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 md:w-6 md:h-6" />
                  Notification Preferences
                </h3>

                <div className="space-y-4 md:space-y-6">
                  {[
                    {
                      id: "paymentReminders",
                      label: "Payment Reminders",
                      description: "Get reminders before your loan payment is due"
                    },
                    {
                      id: "statusUpdates",
                      label: "Application Status Updates",
                      description: "Receive updates on your loan applications"
                    },
                    {
                      id: "marketing",
                      label: "Marketing & Promotions",
                      description: "Receive information about new products and offers"
                    }
                  ].map((pref) => (
                    <div
                      key={pref.id}
                      className="flex items-start gap-4 p-4 md:p-6 border border-slate-200 rounded-2xl md:rounded-3xl hover:border-primary/30 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={pref.id}
                        checked={notifications[pref.id as keyof typeof notifications]}
                        onChange={() => handleNotificationChange(pref.id)}
                        className="mt-1 w-5 h-5 md:w-6 md:h-6 rounded cursor-pointer accent-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={pref.id}
                          className="block font-semibold text-slate-900 text-sm md:text-base mb-1 cursor-pointer"
                        >
                          {pref.label}
                        </label>
                        <p className="text-xs md:text-sm text-slate-600">
                          {pref.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-slate-200 pt-6 mt-6">
                    <h4 className="font-semibold text-slate-900 mb-4 text-sm md:text-base">
                      Notification Channels
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      {[
                        { id: "emailNotifications", label: "Email Notifications" },
                        { id: "smsNotifications", label: "SMS Notifications" }
                      ].map((channel) => (
                        <div
                          key={channel.id}
                          className="flex items-center gap-4 p-4 md:p-6 border border-slate-200 rounded-2xl md:rounded-3xl hover:border-primary/30 transition-colors"
                        >
                          <input
                            type="checkbox"
                            id={channel.id}
                            checked={notifications[channel.id as keyof typeof notifications]}
                            onChange={() => handleNotificationChange(channel.id)}
                            className="w-5 h-5 md:w-6 md:h-6 rounded cursor-pointer accent-primary"
                          />
                          <label
                            htmlFor={channel.id}
                            className="font-semibold text-slate-900 text-sm md:text-base cursor-pointer flex-1"
                          >
                            {channel.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base mt-6"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="mt-8 md:mt-12">
            <Button
              onClick={() => setLocation("/login")}
              className="w-full rounded-full border-2 border-destructive bg-destructive/10 hover:bg-destructive/20 text-destructive font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              Logout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
