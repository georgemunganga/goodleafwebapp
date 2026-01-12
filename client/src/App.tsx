import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LoanHistory from "./pages/LoanHistory";
import LoanDetails from "./pages/LoanDetails";
import Profile from "./pages/Profile";
import LoanApplication from "./pages/LoanApplication";
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
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import LoanApplicationSuccess from "./pages/LoanApplicationSuccess";
import PaymentHistory from "./pages/PaymentHistory";
import AppLayout from "./components/AppLayout";

function AppRouter() {
  return (
    <Switch>
      {/* Root redirect to login */}
      <Route path={"/"}>
        {() => <Redirect to="/login" />}
      </Route>

      {/* Auth Pages - No Layout */}
      <Route path={"/login"} component={Login} />
      <Route path={"/forgot-pin"} component={ForgotPIN} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      
      {/* Protected App Pages with Layout */}
      <Route path={"/dashboard"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/loans"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <LoanHistory />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/loans/:id"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <LoanDetails />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/loans/:id/payment-history"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <PaymentHistory />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/profile"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      {/* Loan Application - Protected but no AppLayout for cleaner wizard experience */}
      <Route path={"/apply"}>
        {() => (
          <ProtectedRoute>
            <LoanApplication />
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/apply-success"}>
        {() => (
          <ProtectedRoute>
            <LoanApplicationSuccess />
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/check-eligibility"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <PreEligibilityChecker />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/kyc"}>
        {() => (
          <ProtectedRoute>
            <KYCWorkflow />
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/repayment"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <RepaymentSubmission />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/early-repayment"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <EarlyRepaymentCalculator />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/restructuring"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <LoanRestructuring />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      {/* Settings Pages - Protected */}
      <Route path={"/personal-details"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <PersonalDetails />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/change-pin"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <ChangePIN />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/notifications"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <NotificationsSettings />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/security"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <SecuritySettings />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/help"}>
        {() => (
          <ProtectedRoute>
            <AppLayout>
              <HelpSupport />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>

      {/* Fallback */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
