import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PreEligibilityChecker from "./pages/PreEligibilityChecker";
import LoanApplication from "./pages/LoanApplication";
import Dashboard from "./pages/Dashboard";
import KYCWorkflow from "./pages/KYCWorkflow";
import LoanHistory from "./pages/LoanHistory";
import LoanDetails from "./pages/LoanDetails";
import Profile from "./pages/Profile";
import RepaymentSubmission from "./pages/RepaymentSubmission";
import EarlyRepaymentCalculator from "./pages/EarlyRepaymentCalculator";
import LoanRestructuring from "./pages/LoanRestructuring";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/eligibility-checker"} component={PreEligibilityChecker} />
      <Route path={"/apply"} component={LoanApplication} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/kyc"} component={KYCWorkflow} />
      <Route path={"/loans"} component={LoanHistory} />
      <Route path={"/loans/:id"} component={LoanDetails} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/repayment"} component={RepaymentSubmission} />
      <Route path={"/early-repayment"} component={EarlyRepaymentCalculator} />
      <Route path={"/restructuring"} component={LoanRestructuring} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
