import AuthGate from "@/components/AuthGate";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import Home from "./pages/Home";
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
      {/* Public Pages */}
      <Route path={"/login"} component={Login} />
      <Route path={"/apply"} component={LoanApplication} />

      {/* App Pages with Layout */}
      <ProtectedRoute path={"/"}>
        <Home />
      </ProtectedRoute>

      <ProtectedRoute path={"/dashboard"}>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path={"/loans"}>
        <AppLayout>
          <LoanHistory />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path={"/loans/:id"}>
        <AppLayout>
          <LoanDetails />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path={"/profile"}>
        <AppLayout>
          <Profile />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path={"/check-eligibility"}>
        <AppLayout>
          <PreEligibilityChecker />
        </AppLayout>
      </ProtectedRoute>
      <ProtectedRoute path={"/eligibility-checker"}>
        <Redirect to="/check-eligibility" />
      </ProtectedRoute>

      <ProtectedRoute path={"/kyc"}>
        <KYCWorkflow />
      </ProtectedRoute>

      <ProtectedRoute path={"/repayment"}>
        <AppLayout>
          <RepaymentSubmission />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path={"/early-repayment"}>
        <AppLayout>
          <EarlyRepaymentCalculator />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path={"/restructuring"}>
        <AppLayout>
          <LoanRestructuring />
        </AppLayout>
      </ProtectedRoute>

      {/* Fallback */}
      <ProtectedRoute path={"/404"}>
        <NotFound />
      </ProtectedRoute>
      <Route>
        {() => (
          <AuthGate>
            <NotFound />
          </AuthGate>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return <AppRouter />;
}

export default App;
