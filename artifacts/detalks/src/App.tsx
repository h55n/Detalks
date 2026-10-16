import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AnimatePresence } from "framer-motion";
import type { ComponentType } from "react";

// Pages
import Splash from "@/pages/Splash";
import Onboarding1 from "@/pages/Onboarding1";
import Onboarding2 from "@/pages/Onboarding2";
import Onboarding3 from "@/pages/Onboarding3";
import Auth from "@/pages/Auth";
import PulseCheck from "@/pages/PulseCheck";
import Home from "@/pages/Home";
import Talk from "@/pages/Talk";
import ActiveSession from "@/pages/ActiveSession";
import CommunityCircle from "@/pages/CommunityCircle";
import Journal from "@/pages/Journal";
import JournalWrite from "@/pages/JournalWrite";
import Breathe from "@/pages/Breathe";
import Practices from "@/pages/Practices";
import Grounding from "@/pages/Grounding";
import Reflection from "@/pages/Reflection";
import Resources from "@/pages/Resources";
import PreCheck from "@/pages/PreCheck";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";
import MoodTracker from "@/pages/MoodTracker";
import SessionReflection from "@/pages/SessionReflection";
import Professional from "@/pages/Professional";
import SessionHistory from "@/pages/SessionHistory";
import Consent from "@/pages/Consent";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function FullPageLoader() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 animate-pulse" />
    </div>
  );
}

function Private({ component: Component }: { component: ComponentType }) {
  const { user, authLoading } = useAppContext();
  if (authLoading) return <FullPageLoader />;
  if (!user) return <Redirect to="/auth" />;
  return <Component />;
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Splash} />
        <Route path="/splash" component={Splash} />
        <Route path="/onboarding/1" component={Onboarding1} />
        <Route path="/onboarding/2" component={Onboarding2} />
        <Route path="/onboarding/3" component={Onboarding3} />
        <Route path="/auth" component={Auth} />
        {/* Crisis and self-help info stays reachable without an account */}
        <Route path="/resources" component={Resources} />

        <Route path="/pulse-check">{() => <Private component={PulseCheck} />}</Route>
        <Route path="/home">{() => <Private component={Home} />}</Route>
        <Route path="/talk">{() => <Private component={Talk} />}</Route>
        <Route path="/consent">{() => <Private component={Consent} />}</Route>
        <Route path="/session/precheck">{() => <Private component={PreCheck} />}</Route>
        <Route path="/session/active/:id">
          {(params) => <Private component={() => <ActiveSession id={params.id} />} />}
        </Route>
        <Route path="/session/reflection/:id">
          {(params) => <Private component={() => <SessionReflection id={params.id} />} />}
        </Route>
        <Route path="/professional">{() => <Private component={Professional} />}</Route>
        <Route path="/history">{() => <Private component={SessionHistory} />}</Route>
        <Route path="/tools/mood-tracker">{() => <Private component={MoodTracker} />}</Route>
        <Route path="/community/circle/:id">
          {(params) => <Private component={() => <CommunityCircle id={params.id} />} />}
        </Route>
        <Route path="/journal">{() => <Private component={Journal} />}</Route>
        <Route path="/journal/write">{() => <Private component={JournalWrite} />}</Route>
        <Route path="/journal/edit/:id">
          {(params) => <Private component={() => <JournalWrite id={params.id} />} />}
        </Route>
        <Route path="/practice">{() => <Private component={Practices} />}</Route>
        <Route path="/practice/breathe">{() => <Private component={Breathe} />}</Route>
        <Route path="/practice/grounding/:id">
          {(params) => <Private component={() => <Grounding />} />}
        </Route>
        <Route path="/practice/reflection">{() => <Private component={Reflection} />}</Route>
        <Route path="/progress">{() => <Private component={Progress} />}</Route>
        <Route path="/profile">{() => <Private component={Profile} />}</Route>
        <Route path="/subscription">{() => <Private component={Subscription} />}</Route>

        {/* Old route from the prototype kept working */}
        <Route path="/tools/practices">{() => <Redirect to="/practice" />}</Route>

        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <PhoneFrame>
              <Router />
            </PhoneFrame>
          </WouterRouter>
        </AppProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
