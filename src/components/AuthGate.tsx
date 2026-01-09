import { ReactNode } from "react";
import { Redirect } from "wouter";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGateProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AuthGate({ children, redirectTo = "/login" }: AuthGateProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        <div className="flex items-center gap-2">
          <Spinner className="size-5" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to={redirectTo} />;
  }

  return <>{children}</>;
}
