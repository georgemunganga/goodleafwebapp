import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Lock, Bell, LogOut, ChevronRight, User, Shield, HelpCircle, FileText, Phone, Mail, MapPin, Camera, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Profile Page
 * Design: Mobile-native banking app style matching reference designs
 * - Green gradient header with profile
 * - Contact info section
 * - Settings menu list
 */
export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, isLoading, error, fetchUserProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => fetchUserProfile()} className="bg-primary hover:bg-[#256339]">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Create profile object from user data
  const profile = {
    firstName: user?.name?.split(' ')[0] || "User",
    lastName: user?.name?.split(' ').slice(1).join(' ') || "",
    email: user?.email || "",
    phone: user?.phone || "+260 123 456 789",
    address: user?.address || "Address not provided",
    initials: user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "U"
  };

  const menuItems = [
    {
      icon: User,
      label: "Personal Details",
      description: "Name, email, phone",
      action: () => toast.info("Feature coming soon")
    },
    {
      icon: Lock,
      label: "Change PIN",
      description: "Update your login PIN",
      action: () => toast.info("Feature coming soon")
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Payment reminders, alerts",
      action: () => toast.info("Feature coming soon")
    },
    {
      icon: Shield,
      label: "Security",
      description: "2FA, active sessions",
      action: () => toast.info("Feature coming soon")
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
      action: () => toast.info("Feature coming soon")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Green gradient */}
      <header className="bg-gradient-to-br from-[#2e7146] to-[#1d4a2f] text-white">
        <div className="px-5 pt-6 pb-10">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>

          {/* Profile Card */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                <span className="text-2xl font-bold text-white">{profile.initials}</span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-primary" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-white/70 text-sm">{profile.email}</p>
            </div>
            <button
              onClick={() => toast.info("Feature coming soon")}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 -mt-4 pb-8 space-y-4">
        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Contact Information</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">{profile.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{profile.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Settings</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 rounded-2xl text-red-600 font-semibold hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

        {/* App Version & Legal */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-400 mb-3">Goodleaf Loans v1.0.0</p>
          <div className="flex justify-center gap-4">
            <button className="text-xs text-gray-500 hover:text-primary">Terms of Service</button>
            <span className="text-gray-300">|</span>
            <button className="text-xs text-gray-500 hover:text-primary">Privacy Policy</button>
          </div>
        </div>
      </main>
    </div>
  );
}
