import { ReactNode } from "react";
import { Route } from "wouter";
import AuthGate from "@/components/AuthGate";

interface ProtectedRouteProps {
  path: string;
  children: ReactNode;
}

export default function ProtectedRoute({ path, children }: ProtectedRouteProps) {
  return (
    <Route path={path}>
      {() => <AuthGate>{children}</AuthGate>}
    </Route>
  );
}
