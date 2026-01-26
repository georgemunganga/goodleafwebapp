import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import * as Types from "@/lib/api-types";
import { useUpdateUserProfile, useUserProfile } from "@/hooks/useUserQueries";
import { ArrowLeft, Edit2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

/**
 * Personal Details Page
 * Design: Mobile-native banking app style with consistent sizing
 * - Edit personal information
 * - Save changes
 */
export default function PersonalDetails() {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const profileQuery = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const isLoading = profileQuery.isLoading;
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Types.UpdateProfileRequest>({});

  useEffect(() => {
    if (!profileQuery.data || isEditing) return;
    const profile = profileQuery.data;
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      city: profile.city,
      country: profile.country,
    });
  }, [profileQuery.data, isEditing]);

  const loadError = profileQuery.error
    ? profileQuery.error instanceof Error
      ? profileQuery.error.message
      : "Failed to load personal details."
    : null;
  const displayError = error ?? loadError;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await updateProfile.mutateAsync(formData);
      if (response?.user) {
        setFormData({
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          phone: response.user.phone,
          address: response.user.address,
          city: response.user.city,
          country: response.user.country,
        });
      }
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to save changes.");
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Personal Details</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
              disabled={isLoading}
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm font-semibold">{isEditing ? "Cancel" : "Edit"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        <div className="space-y-5">
          {displayError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-800">{displayError}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner variant="spinner" size="lg" color="primary" />
            </div>
          ) : (
            <>
              {/* First Name */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <label className="block text-base font-bold text-gray-900 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName || ""}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                  />
                ) : (
                  <p className="text-base text-gray-900 font-medium">{formData.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <label className="block text-base font-bold text-gray-900 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName || ""}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                  />
                ) : (
                  <p className="text-base text-gray-900 font-medium">{formData.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <label className="block text-base font-bold text-gray-900 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                  />
                ) : (
                  <p className="text-base text-gray-900 font-medium">{formData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <label className="block text-base font-bold text-gray-900 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                  />
                ) : (
                  <p className="text-base text-gray-900 font-medium">{formData.phone}</p>
                )}
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <label className="block text-base font-bold text-gray-900 mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                  />
                ) : (
                  <p className="text-base text-gray-900 font-medium">{formData.address}</p>
                )}
              </div>

              {/* Save Button */}
              {isEditing && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
