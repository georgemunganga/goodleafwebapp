import { ArrowLeft, Bell, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const settingsOptions = [
  {
    title: "Notification Settings",
    description: "Control which alerts arrive via email, SMS, or push.",
    path: "/notifications",
    icon: Bell,
  },
  {
    title: "Security Settings",
    description: "Update your PIN, login methods, and device access.",
    path: "/security",
    icon: ShieldCheck,
  },
];

export default function Settings() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <header className="bg-white border-b border-gray-100 px-5 py-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <button
            onClick={() => setLocation("/profile")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pick where you want to manage preferences for your account.
        </p>
      </header>

      <main className="flex-1 px-5 py-6 space-y-4">
        {settingsOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">{option.title}</p>
                  <p className="text-sm text-slate-500">{option.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setLocation(option.path)}
                className="w-full justify-center"
              >
                Open {option.title}
              </Button>
            </div>
          );
        })}
      </main>
    </div>
  );
}
