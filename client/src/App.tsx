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

function Router() {
  return (
    <Switch>
      <Route path={"/login"} component={Login} />
      <Route path={"/set-pin"} component={SetPin} />
      <Route path={"/forgot-pin"} component={ForgotPIN} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      
      {/* Protected Routes */}
      <Route path={"/dashboard"} component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path={"/apply"} component={LoanApplication} />
      <Route path={"/apply-success"} component={LoanApplicationSuccess} />
      <Route path={"/loans"} component={() => <ProtectedRoute><LoanHistory /></ProtectedRoute>} />
      <Route path={"/loans/:id"} component={() => <ProtectedRoute><LoanDetails /></ProtectedRoute>} />
      <Route path={"/:id/payment-history"} component={() => <ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
      <Route path={"/profile"} component={() => <ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path={"/personal-details"} component={() => <ProtectedRoute><PersonalDetails /></ProtectedRoute>} />
      <Route path={"/change-pin"} component={() => <ProtectedRoute><ChangePIN /></ProtectedRoute>} />
      <Route path={"/notifications"} component={() => <ProtectedRoute><NotificationsSettings /></ProtectedRoute>} />
      <Route path={"/security"} component={() => <ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
      <Route path={"/help"} component={() => <ProtectedRoute><HelpSupport /></ProtectedRoute>} />
      <Route path={"/check-eligibility"} component={() => <ProtectedRoute><PreEligibilityChecker /></ProtectedRoute>} />
      <Route path={"/kyc"} component={() => <ProtectedRoute><KYCWorkflow /></ProtectedRoute>} />
      <Route path={"/repayment"} component={() => <ProtectedRoute><RepaymentSubmission /></ProtectedRoute>} />
      <Route path={"/early-repayment"} component={() => <ProtectedRoute><EarlyRepaymentCalculator /></ProtectedRoute>} />
      <Route path={"/restructure"} component={() => <ProtectedRoute><LoanRestructuring /></ProtectedRoute>} />

      <Route path={"/"} component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
