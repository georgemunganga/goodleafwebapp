import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLocation } from "wouter";
import { Lock, Bell, LogOut, ChevronRight, User, Shield, HelpCircle, FileText, Phone, Mail, MapPin, Camera, Edit2, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUpdateUserProfile, useUserProfile } from "@/hooks/useUserQueries";
import { toast } from "sonner";

/**
 * Profile Page
 * Design: Mobile-native banking app style with consistent sizing
 * - Green gradient header with profile
 * - Contact info section
 * - Settings menu list
 */
export default function Profile() {
  const [, setLocation] = useLocation();
  const { logout, user } = useAuthContext();
  const profileQuery = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const profile = profileQuery.data ?? null;
  const isLoading = profileQuery.isLoading;
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const error = profileQuery.error
    ? profileQuery.error instanceof Error
      ? profileQuery.error.message
      : "Failed to load profile."
    : null;

  const initials = useMemo(() => {
    if (!profile) return "";
    return `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();
  }, [profile]);
  const avatarSrc = profileQuery.data ? (profile?.avatar ?? null) : (user?.avatar ?? null);

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be 5MB or smaller.");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const avatarDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
            return;
          }
          reject(new Error("Failed to read the selected image."));
        };
        reader.onerror = () => reject(new Error("Failed to read the selected image."));
        reader.readAsDataURL(file);
      });

      await updateProfile.mutateAsync({ avatar: avatarDataUrl });
      setAvatarLoadFailed(false);
      toast.success("Profile photo updated.");
    } catch (uploadError) {
      console.error("Failed to upload profile photo:", uploadError);
      toast.error("Failed to update profile photo.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploadingAvatar(true);
      await updateProfile.mutateAsync({ removeAvatar: true });
      setAvatarLoadFailed(false);
      toast.success("Profile photo removed.");
    } catch (removeError) {
      console.error("Failed to remove profile photo:", removeError);
      toast.error("Failed to remove profile photo.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: "Personal Details",
      description: "Name, email, phone",
      action: () => setLocation("/personal-details")
    },
    {
      icon: Lock,
      label: "Change PIN",
      description: "Update your login PIN",
      action: () => setLocation("/change-pin")
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Payment reminders, alerts",
      action: () => setLocation("/notifications")
    },
    {
      icon: Shield,
      label: "Security",
      description: "2FA, active sessions",
      action: () => setLocation("/security")
    },
    {
      icon: FileText,
      label: "Documents",
      description: "KYC, uploaded files",
      action: () => setLocation("/kyc")
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQs, contact us",
      action: () => setLocation("/help")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header - Green gradient */}
      <header className="bg-gradient-to-br from-[#2e7146] to-[#1d4a2f] text-white">
        <div className="px-5 pt-6 pb-10">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>

          {/* Profile Card */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                {isLoading ? (
                  <LoadingSpinner variant="spinner" size="sm" color="white" />
                ) : avatarSrc && !avatarLoadFailed ? (
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                    onError={() => setAvatarLoadFailed(true)}
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">{initials || "--"}</span>
                )}
              </div>
              <button
                onClick={handleAvatarButtonClick}
                disabled={isLoading || isUploadingAvatar}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-60"
              >
                <Camera className="w-4 h-4 text-primary" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelected}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {profile ? `${profile.firstName} ${profile.lastName}` : "Loading..."}
              </h2>
              <p className="text-white/70 text-sm">{profile?.email || ""}</p>
              {avatarSrc && !avatarLoadFailed && (
                <button
                  onClick={handleRemoveAvatar}
                  disabled={isUploadingAvatar}
                  className="mt-2 inline-flex items-center gap-2 text-xs text-white/80 hover:text-white disabled:opacity-60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove photo
                </button>
              )}
            </div>
            <button
              onClick={() => setLocation("/personal-details")}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 -mt-4 pb-8 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Contact Information</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="font-bold text-gray-900 text-base truncate">{profile?.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="font-bold text-gray-900 text-base truncate">{profile?.email || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-bold text-gray-900 text-base truncate">{profile?.address || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Settings</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-bold text-gray-900 text-base">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            setLocation("/login");
          }}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 rounded-2xl text-red-600 font-bold text-base hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-6 h-6" />
          <span>Logout</span>
        </button>

        {/* App Version & Legal */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-400 mb-3">Goodleaf Loans v1.0.0</p>
          <div className="flex justify-center gap-4">
            <button className="text-sm text-gray-500 hover:text-primary font-medium">Terms of Service</button>
            <span className="text-gray-300">/</span>
            <button className="text-sm text-gray-500 hover:text-primary font-medium">Privacy Policy</button>
          </div>
        </div>
      </main>
    </div>
  );
}
