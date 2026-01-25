import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Lock, Smartphone, Clock, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { securityService } from "@/lib/api-service";
import * as Types from "@/lib/api-types";

/**
 * Security Settings Page
 * Design: Mobile-native banking app style with consistent sizing
 * - 2FA settings
 * - Active sessions
 * - Login history
 */
export default function SecuritySettings() {
  const [, setLocation] = useLocation();
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions] = useState([
    { device: "iPhone 12", location: "Lusaka, Zambia", lastActive: "2 hours ago", isCurrent: true },
    { device: "Chrome on Windows", location: "Lusaka, Zambia", lastActive: "1 day ago", isCurrent: false }
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await securityService.getSecuritySettings();
        setTwoFAEnabled(settings.twoFactorEnabled);
        setError(null);
      } catch (err) {
        console.error("Failed to load security settings:", err);
        setError("Failed to load security settings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleTwoFactorToggle = async () => {
    if (isLoading || isSaving) return;

    try {
      setIsSaving(true);
      if (!twoFAEnabled) {
        const response = await securityService.enableTwoFactor({ method: "sms" } as Types.EnableTwoFactorRequest);
        if (!response.success) {
          setError(response.message || "Failed to enable two-factor authentication.");
          return;
        }
      }
      setTwoFAEnabled(!twoFAEnabled);
      setError(null);
    } catch (err) {
      console.error("Failed to update 2FA:", err);
      setError("Failed to update two-factor authentication.");
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
          <h1 className="text-2xl font-bold">Security</h1>
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

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add extra security to your account</p>
                </div>
              </div>
              <button
                onClick={handleTwoFactorToggle}
                className={`w-14 h-8 rounded-full transition-colors ${
                  twoFAEnabled ? "bg-primary" : "bg-gray-300"
                }`}
                disabled={isLoading || isSaving}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    twoFAEnabled ? "translate-x-7" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
            {twoFAEnabled && (
              <p className="text-sm text-green-600 font-medium">Enabled</p>
            )}
          </div>

          {/* Active Sessions */}
          <div className="mt-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Active Sessions</h2>
            <div className="space-y-3">
              {sessions.map((session, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Smartphone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-base text-gray-900">{session.device}</p>
                        <p className="text-sm text-gray-500">{session.location}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
                        </div>
                      </div>
                    </div>
                    {session.isCurrent && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  {!session.isCurrent && (
                    <button className="w-full text-red-600 font-bold text-sm hover:text-red-700 transition-colors">
                      Sign Out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Change PIN */}
          <div className="mt-6">
            <Button
              onClick={() => setLocation("/change-pin")}
              className="w-full h-12 bg-white hover:bg-gray-50 text-primary font-bold text-base rounded-xl border-2 border-primary"
            >
              Change PIN
            </Button>
          </div>

          {/* Sign Out All Devices */}
          <Button
            className="w-full h-12 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-base rounded-xl border-2 border-red-200 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out All Devices
          </Button>
        </div>
      </main>
    </div>
  );
}
