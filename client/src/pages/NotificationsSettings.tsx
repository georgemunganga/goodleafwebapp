import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, MessageSquare, AlertCircle } from "lucide-react";
import { useState } from "react";

/**
 * Notifications Settings Page
 * Design: Mobile-native banking app style with consistent sizing
 * - Toggle payment reminders
 * - Toggle alerts
 * - Notification frequency
 */
export default function NotificationsSettings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState({
    paymentReminders: true,
    paymentAlerts: true,
    loanUpdates: true,
    promotions: false,
    frequency: "daily"
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleFrequencyChange = (freq: string) => {
    setSettings({ ...settings, frequency: freq });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
        <div className="px-5 pt-6 pb-6 w-full">
          <button
            onClick={() => setLocation("/profile")}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        <div className="space-y-4">
          {/* Payment Reminders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Payment Reminders</p>
                  <p className="text-sm text-gray-500">Get reminded before payment due date</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("paymentReminders")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.paymentReminders ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.paymentReminders ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Payment Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Payment Alerts</p>
                  <p className="text-sm text-gray-500">Alerts for overdue payments</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("paymentAlerts")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.paymentAlerts ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.paymentAlerts ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Loan Updates */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Loan Updates</p>
                  <p className="text-sm text-gray-500">Status updates on your loans</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("loanUpdates")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.loanUpdates ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.loanUpdates ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Promotions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Promotions</p>
                  <p className="text-sm text-gray-500">Special offers and promotions</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("promotions")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.promotions ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.promotions ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Notification Frequency */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-6">
            <p className="font-bold text-base text-gray-900 mb-4">Notification Frequency</p>
            <div className="space-y-3">
              {[
                { value: "immediate", label: "Immediate" },
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFrequencyChange(option.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left font-bold text-base transition-all ${
                    settings.frequency === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button
            className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl mt-6"
          >
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
}
