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

      <Route path={"/loans/:id"}>
        {() => (
          <AppLayout>
            <LoanDetails />
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
