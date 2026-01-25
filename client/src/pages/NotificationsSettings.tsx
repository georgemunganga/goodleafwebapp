import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, MessageSquare, AlertCircle, Mail, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { notificationService } from "@/lib/api-service";
import * as Types from "@/lib/api-types";

/**
 * Notifications Settings Page
 * Design: Mobile-native banking app style with consistent sizing
 * - Toggle payment reminders
 * - Toggle alerts
 * - Notification frequency
 */
export default function NotificationsSettings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState<Types.NotificationSettings>({
    userId: "",
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    paymentReminders: true,
    applicationUpdates: true,
    promotions: false,
    reminderFrequency: "daily",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await notificationService.getNotificationSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load notification settings:", err);
        setError("Failed to load notification settings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (key: keyof Types.NotificationSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleFrequencyChange = (freq: Types.NotificationSettings["reminderFrequency"]) => {
    setSettings({ ...settings, reminderFrequency: freq });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await notificationService.updateNotificationSettings({
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        pushNotifications: settings.pushNotifications,
        paymentReminders: settings.paymentReminders,
        applicationUpdates: settings.applicationUpdates,
        promotions: settings.promotions,
        reminderFrequency: settings.reminderFrequency,
      });
      setError(null);
    } catch (err) {
      console.error("Failed to save notification settings:", err);
      setError("Failed to save notification settings.");
    } finally {
      setIsSaving(false);
    }
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
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Email Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Updates sent via email</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("emailNotifications")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.emailNotifications ? "bg-primary" : "bg-gray-300"
                }`}
                disabled={isLoading}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.emailNotifications ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Critical alerts via SMS</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("smsNotifications")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.smsNotifications ? "bg-primary" : "bg-gray-300"
                }`}
                disabled={isLoading}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.smsNotifications ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500">In-app alerts and reminders</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("pushNotifications")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.pushNotifications ? "bg-primary" : "bg-gray-300"
                }`}
                disabled={isLoading}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.pushNotifications ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

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
                disabled={isLoading}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.paymentReminders ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Application Updates */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Application Updates</p>
                  <p className="text-sm text-gray-500">Status updates on your loans</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("applicationUpdates")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.applicationUpdates ? "bg-primary" : "bg-gray-300"
                }`}
                disabled={isLoading}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.applicationUpdates ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Promotions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
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
                disabled={isLoading}
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
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFrequencyChange(option.value as Types.NotificationSettings["reminderFrequency"])}
                  className={`w-full p-4 rounded-xl border-2 text-left font-bold text-base transition-all ${
                    settings.reminderFrequency === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button
            className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl mt-6"
            onClick={handleSave}
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </main>
    </div>
  );
}
