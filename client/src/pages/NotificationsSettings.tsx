import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, MessageSquare, AlertCircle, Mail, Smartphone, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import * as Types from "@/lib/api-types";
import { useNotificationSettings, useUpdateNotificationSettings } from "@/hooks/useUserQueries";
import { toast } from "sonner";

/**
 * Notifications Settings Page
 * Design: Mobile-native banking app style with consistent sizing
 * - Auto-save on toggle with optimistic UI
 * - Rollback on API failure
 * - Toast feedback for every action
 */

type ToggleKey = "emailNotifications" | "smsNotifications" | "pushNotifications" | "paymentReminders" | "applicationUpdates" | "promotions";

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
    notificationFrequency: "monthly",
  });
  const settingsQuery = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();
  const isLoading = settingsQuery.isLoading;
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keep track of last confirmed server state for rollback
  const serverStateRef = useRef<Types.NotificationSettings | null>(null);

  useEffect(() => {
    if (!settingsQuery.data) return;
    setSettings(settingsQuery.data);
    serverStateRef.current = settingsQuery.data;
    setError(null);
  }, [settingsQuery.data]);

  useEffect(() => {
    if (!settingsQuery.error) return;
    console.error("Failed to load notification settings:", settingsQuery.error);
    setError("Failed to load notification settings.");
    toast.error("Failed to load settings");
  }, [settingsQuery.error]);

  // Auto-save function with optimistic update and rollback
  const saveSettings = useCallback(async (newSettings: Types.NotificationSettings, changedKey: string) => {
    const previousState = serverStateRef.current;

    try {
      setSavingKey(changedKey);

      // Call API
      const response = await updateSettings.mutateAsync({
        emailNotifications: newSettings.emailNotifications,
        smsNotifications: newSettings.smsNotifications,
        pushNotifications: newSettings.pushNotifications,
        paymentReminders: newSettings.paymentReminders,
        applicationUpdates: newSettings.applicationUpdates,
        promotions: newSettings.promotions,
        notificationFrequency: newSettings.notificationFrequency,
      });

      // Success - update server state reference
      const nextState = response ?? newSettings;
      setSettings(nextState);
      serverStateRef.current = nextState;
      setError(null);
      toast.success("Setting updated");

    } catch (err) {
      console.error("Failed to save setting:", err);

      // Rollback to previous server state
      if (previousState) {
        setSettings(previousState);
        toast.error("Failed to update. Reverted to previous setting.");
      } else {
        toast.error("Failed to update setting");
      }
    } finally {
      setSavingKey(null);
    }
  }, [updateSettings]);

  const handleToggle = useCallback((key: ToggleKey) => {
    if (savingKey) return; // Prevent multiple simultaneous saves

    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };

    // Optimistic update
    setSettings(newSettings);

    // Auto-save to API
    saveSettings(newSettings, key);
  }, [settings, savingKey, saveSettings]);

  const handleFrequencyChange = useCallback((freq: Types.NotificationFrequency) => {
    if (savingKey || settings.notificationFrequency === freq) return;

    const newSettings = {
      ...settings,
      notificationFrequency: freq
    };

    // Optimistic update
    setSettings(newSettings);

    // Auto-save to API
    saveSettings(newSettings, "notificationFrequency");
  }, [settings, savingKey, saveSettings]);

  // Toggle switch component with loading state
  const ToggleSwitch = ({
    settingKey,
    enabled
  }: {
    settingKey: ToggleKey;
    enabled: boolean;
  }) => {
    const isSaving = savingKey === settingKey;

    return (
      <button
        onClick={() => handleToggle(settingKey)}
        className={`relative w-14 h-8 rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-gray-300"
        } ${isSaving ? "opacity-70" : ""}`}
        disabled={isLoading || isSaving}
        aria-label={enabled ? "Enabled" : "Disabled"}
      >
        <div
          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform flex items-center justify-center ${
            enabled ? "translate-x-7" : "translate-x-1"
          }`}
        >
          {isSaving && (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          )}
        </div>
      </button>
    );
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
          <p className="text-white/70 text-sm mt-1">Changes save automatically</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-800">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
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
              <ToggleSwitch
                settingKey="emailNotifications"
                enabled={settings.emailNotifications}
              />
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
              <ToggleSwitch
                settingKey="smsNotifications"
                enabled={settings.smsNotifications}
              />
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
              <ToggleSwitch
                settingKey="pushNotifications"
                enabled={settings.pushNotifications}
              />
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
              <ToggleSwitch
                settingKey="paymentReminders"
                enabled={settings.paymentReminders}
              />
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
              <ToggleSwitch
                settingKey="applicationUpdates"
                enabled={settings.applicationUpdates}
              />
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
              <ToggleSwitch
                settingKey="promotions"
                enabled={settings.promotions}
              />
            </div>
          </div>

          {/* Notification Frequency */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-6">
            <p className="font-bold text-base text-gray-900 mb-4">Notification Frequency</p>
            <div className="space-y-3">
              {(settings.frequencyOptions || ["daily", "weekly", "monthly"]).map((freq) => {
                const isSelected = settings.notificationFrequency === freq;
                const isSaving = savingKey === "notificationFrequency" && isSelected;

                return (
                  <button
                    key={freq}
                    onClick={() => handleFrequencyChange(freq)}
                    className={`w-full p-4 rounded-xl border-2 text-left font-bold text-base transition-all capitalize flex items-center justify-between ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    disabled={isLoading || !!savingKey}
                  >
                    <span>{freq.charAt(0).toUpperCase() + freq.slice(1)}</span>
                    {isSaving && (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
