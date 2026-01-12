import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
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
      <Route path={"/apply-success"} component={LoanApplicationSuccess} />
      
      {/* App Pages with Layout */}
      <Route path={"/dashboard"}>
        {() => (
          <AppLayout>
            <Dashboard />
          </AppLayout>
        )}
      </Route>

      <Route path={"/loans"}>
        {() => (
          <AppLayout>
            <LoanHistory />
          </AppLayout>
        )}
      </Route>

      <Route path={"/:id"}>
        {() => (
          <AppLayout>
            <LoanDetails />
          </AppLayout>
        )}
      </Route>

      <Route path={"/:id/payment-history"}>
        {() => (
          <AppLayout>
            <PaymentHistory />
          </AppLayout>
        )}
      </Route>

      <Route path={"/profile"}>
        {() => (
          <AppLayout>
            <Profile />
          </AppLayout>
        )}
      </Route>

      {/* Loan Application - No AppLayout for cleaner wizard experience */}
      <Route path={"/apply"} component={LoanApplication} />

      <Route path={"/check-eligibility"}>
        {() => (
          <AppLayout>
            <PreEligibilityChecker />
          </AppLayout>
        )}
      </Route>

      <Route path={"/kyc"} component={KYCWorkflow} />

      <Route path={"/repayment"}>
        {() => (
          <AppLayout>
            <RepaymentSubmission />
          </AppLayout>
        )}
      </Route>

      <Route path={"/early-repayment"}>
        {() => (
          <AppLayout>
            <EarlyRepaymentCalculator />
          </AppLayout>
        )}
      </Route>

      <Route path={"/restructuring"}>
        {() => (
          <AppLayout>
            <LoanRestructuring />
          </AppLayout>
        )}
      </Route>

      {/* Settings Pages */}
      <Route path={"/personal-details"}>
        {() => (
          <AppLayout>
            <PersonalDetails />
          </AppLayout>
        )}
      </Route>

      <Route path={"/change-pin"}>
        {() => (
          <AppLayout>
            <ChangePIN />
          </AppLayout>
        )}
      </Route>

      <Route path={"/notifications"}>
        {() => (
          <AppLayout>
            <NotificationsSettings />
          </AppLayout>
        )}
      </Route>

      <Route path={"/security"}>
        {() => (
          <AppLayout>
            <SecuritySettings />
          </AppLayout>
        )}
      </Route>

      <Route path={"/help"}>
        {() => (
          <AppLayout>
            <HelpSupport />
          </AppLayout>
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
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
