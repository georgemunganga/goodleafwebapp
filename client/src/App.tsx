import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NetworkProvider } from "./contexts/NetworkContext";
import { GlobalLoadingIndicator } from "./components/GlobalLoadingIndicator";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { QueryProvider } from "./providers/QueryProvider";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ModalProvider } from "./contexts/ModalContext";
import { ModalRenderer } from "./components/ModalRenderer";
import AppLayout from "./components/AppLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SetPin from "./pages/SetPin";
import Dashboard from "./pages/Dashboard";
import LoanApplication from "./pages/LoanApplication";
import LoanApplicationSuccess from "./pages/LoanApplicationSuccess";
import LoanHistory from "./pages/LoanHistory";
import LoanDetails from "./pages/LoanDetails";
import Profile from "./pages/Profile";
import PreEligibilityChecker from "./pages/PreEligibilityChecker";
import KYCWorkflow from "./pages/KYCWorkflow";
import RepaymentSubmission from "./pages/RepaymentSubmission";
import EarlyRepaymentCalculator from "./pages/EarlyRepaymentCalculator";
import LoanRestructuring from "./pages/LoanRestructuring";
import ForgotPIN from "./pages/ForgotPIN";
import PersonalDetails from "./pages/PersonalDetails";
import ChangePIN from "./pages/ChangePIN";
import NotificationsSettings from "./pages/NotificationsSettings";
import SecuritySettings from "./pages/SecuritySettings";
import HelpSupport from "./pages/HelpSupport";
import PaymentHistory from "./pages/PaymentHistory";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Helper component that wraps content with both ProtectedRoute and AppLayout
function ProtectedPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes - No AppLayout */}
      <Route path={"/login"} component={Login} />
      <Route path={"/set-pin"} component={SetPin} />
      <Route path={"/forgot-pin"} component={ForgotPIN} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/apply"} component={LoanApplication} />
      <Route path={"/apply-success"} component={LoanApplicationSuccess} />

      {/* Protected Routes - With AppLayout (sidebar + bottom nav) */}
      <Route path={"/dashboard"} component={() => <ProtectedPage><Dashboard /></ProtectedPage>} />
      <Route path={"/loans"} component={() => <ProtectedPage><LoanHistory /></ProtectedPage>} />
      <Route path={"/loans/:id"} component={() => <ProtectedPage><LoanDetails /></ProtectedPage>} />
      <Route path={"/:id/payment-history"} component={() => <ProtectedPage><PaymentHistory /></ProtectedPage>} />
      <Route path={"/profile"} component={() => <ProtectedPage><Profile /></ProtectedPage>} />
      <Route path={"/personal-details"} component={() => <ProtectedPage><PersonalDetails /></ProtectedPage>} />
      <Route path={"/change-pin"} component={() => <ProtectedPage><ChangePIN /></ProtectedPage>} />
      <Route path={"/notifications"} component={() => <ProtectedPage><NotificationsSettings /></ProtectedPage>} />
      <Route path={"/security"} component={() => <ProtectedPage><SecuritySettings /></ProtectedPage>} />
      <Route path={"/help"} component={() => <ProtectedPage><HelpSupport /></ProtectedPage>} />
      <Route path={"/check-eligibility"} component={() => <ProtectedPage><PreEligibilityChecker /></ProtectedPage>} />
      <Route path={"/kyc"} component={() => <ProtectedPage><KYCWorkflow /></ProtectedPage>} />
      <Route path={"/repayment"} component={() => <ProtectedPage><RepaymentSubmission /></ProtectedPage>} />
      <Route path={"/early-repayment"} component={() => <ProtectedPage><EarlyRepaymentCalculator /></ProtectedPage>} />
      <Route path={"/restructure"} component={() => <ProtectedPage><LoanRestructuring /></ProtectedPage>} />

      <Route path={"/"} component={() => <ProtectedPage><Dashboard /></ProtectedPage>} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <QueryProvider>
            <CurrencyProvider>
              <NetworkProvider>
                <AuthProvider>
                  <ModalProvider>
                  <GlobalLoadingIndicator />
                  <OfflineIndicator />
                  <ModalRenderer />
                  <Toaster />
                  <Router />
                </ModalProvider>
              </AuthProvider>
              </NetworkProvider>
            </CurrencyProvider>
          </QueryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
