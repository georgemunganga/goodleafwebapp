import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Lock, Smartphone, Clock, LogOut, Loader2, Monitor } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { securityService } from "@/lib/api-service";
import * as Types from "@/lib/api-types";
import { useAuthContext } from "@/contexts/AuthContext";
import { useActiveSessions, useSecuritySettings } from "@/hooks/useUserQueries";
import { buildCacheKey, writePersistedCache } from "@/lib/persisted-cache";
import { queryKeys } from "@/hooks/query-keys";
import { toast } from "sonner";

/**
 * Security Settings Page
 * Design: Mobile-native banking app style with consistent sizing
 * - 2FA settings with auto-save
 * - Active sessions from API
 * - Sign out functionality
 */

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export default function SecuritySettings() {
  const [, setLocation] = useLocation();
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [sessions, setSessions] = useState<Types.ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving2FA, setIsSaving2FA] = useState(false);
  const [signingOutSession, setSigningOutSession] = useState<string | null>(null);
  const [isSigningOutAll, setIsSigningOutAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track confirmed server state for rollback
  const serverTwoFARef = useRef<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch both settings and sessions in parallel
        const [settings, activeSessions] = await Promise.all([
          securityService.getSecuritySettings(),
          securityService.getActiveSessions(),
        ]);
        setTwoFAEnabled(settings.twoFactorEnabled);
        serverTwoFARef.current = settings.twoFactorEnabled;
        setSessions(activeSessions);
        setError(null);
      } catch (err) {
        console.error("Failed to load security settings:", err);
        setError("Failed to load security settings.");
        toast.error("Failed to load security settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTwoFactorToggle = useCallback(async () => {
    if (isLoading || isSaving2FA) return;

    const newValue = !twoFAEnabled;
    const previousValue = serverTwoFARef.current;

    // Optimistic update
    setTwoFAEnabled(newValue);

    try {
      setIsSaving2FA(true);

      if (newValue) {
        // Enable 2FA
        const response = await securityService.enableTwoFactor({ method: "sms" });
        if (!response.success) {
          // Rollback
          setTwoFAEnabled(previousValue);
          toast.error(response.message || "Failed to enable 2FA");
          return;
        }
        serverTwoFARef.current = true;
        toast.success("Two-factor authentication enabled");
      } else {
        // Disable 2FA
        const response = await securityService.disableTwoFactor();
        if (!response.success) {
          // Rollback
          setTwoFAEnabled(previousValue);
          toast.error(response.message || "Failed to disable 2FA");
          return;
        }
        serverTwoFARef.current = false;
        toast.success("Two-factor authentication disabled");
      }
      setError(null);
    } catch (err) {
      console.error("Failed to update 2FA:", err);
      // Rollback
      setTwoFAEnabled(previousValue);
      toast.error("Failed to update two-factor authentication");
    } finally {
      setIsSaving2FA(false);
    }
  }, [twoFAEnabled, isLoading, isSaving2FA]);

  const handleSignOutSession = useCallback(async (sessionId: string) => {
    if (signingOutSession || isSigningOutAll) return;

    try {
      setSigningOutSession(sessionId);
      const response = await securityService.signOutSession(sessionId);

      if (response.success) {
        // Remove session from list
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        toast.success("Session terminated");
      } else {
        toast.error(response.message || "Failed to terminate session");
      }
    } catch (err) {
      console.error("Failed to sign out session:", err);
      toast.error("Failed to terminate session");
    } finally {
      setSigningOutSession(null);
    }
  }, [signingOutSession, isSigningOutAll]);

  const handleSignOutAllDevices = useCallback(async () => {
    if (signingOutSession || isSigningOutAll) return;

    try {
      setIsSigningOutAll(true);
      const response = await securityService.signOutAllDevices();

      if (response.success) {
        // Keep only current session
        setSessions(prev => prev.filter(s => s.isCurrent));
        toast.success(`${response.sessionsTerminated} session(s) terminated`);
      } else {
        toast.error(response.message || "Failed to terminate sessions");
      }
    } catch (err) {
      console.error("Failed to sign out all devices:", err);
      toast.error("Failed to terminate sessions");
    } finally {
      setIsSigningOutAll(false);
    }
  }, [signingOutSession, isSigningOutAll]);

  const otherSessions = sessions.filter(s => !s.isCurrent);

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
          <p className="text-white/70 text-sm mt-1">Manage your account security</p>
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

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
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
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  twoFAEnabled ? "bg-primary" : "bg-gray-300"
                } ${isSaving2FA ? "opacity-70" : ""}`}
                disabled={isLoading || isSaving2FA}
                aria-label={twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform flex items-center justify-center ${
                    twoFAEnabled ? "translate-x-7" : "translate-x-1"
                  }`}
                >
                  {isSaving2FA && (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  )}
                </div>
              </button>
            </div>
            {twoFAEnabled && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-green-600 font-medium">Enabled via SMS</p>
              </div>
            )}
          </div>

          {/* Active Sessions */}
          <div className="mt-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Active Sessions</h2>
            <div className="space-y-3">
              {isLoading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
                  <p className="text-gray-500">No active sessions</p>
                </div>
              ) : (
                sessions.map((session) => {
                  const isSigningOut = signingOutSession === session.id;
                  const deviceName = session.device || "Unknown Device";
                  const isMobileDevice = deviceName.toLowerCase().includes("iphone") ||
                                         deviceName.toLowerCase().includes("android");
                  const Icon = isMobileDevice ? Smartphone : Monitor;

                  return (
                    <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-base text-gray-900">{deviceName}</p>
                            <p className="text-sm text-gray-500">{session.location || "Unknown location"}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                Last active: {session.lastActive ? formatRelativeTime(session.lastActive) : "Unknown"}
                              </p>
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
                        <button
                          onClick={() => handleSignOutSession(session.id)}
                          disabled={isSigningOut || isSigningOutAll}
                          className="w-full text-red-600 font-bold text-sm hover:text-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSigningOut ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Signing out...
                            </>
                          ) : (
                            "Sign Out"
                          )}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
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
          {otherSessions.length > 0 && (
            <Button
              onClick={handleSignOutAllDevices}
              disabled={isSigningOutAll || !!signingOutSession}
              className="w-full h-12 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-base rounded-xl border-2 border-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSigningOutAll ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  Sign Out All Other Devices ({otherSessions.length})
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
