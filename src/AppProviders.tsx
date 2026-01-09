import { ReactNode } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalProvider } from "@/contexts/GlobalContext";
import { LoanProvider } from "@/contexts/LoanContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <GlobalProvider>
        <AuthProvider>
          <LoanProvider>
            <ThemeProvider defaultTheme="light">
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
          </LoanProvider>
        </AuthProvider>
      </GlobalProvider>
    </ErrorBoundary>
  );
}
