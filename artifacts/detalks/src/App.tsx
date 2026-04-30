import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AnimatePresence } from "framer-motion";

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

const queryClient = new QueryClient();

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
        <Route path="/pulse-check" component={PulseCheck} />
        <Route path="/home" component={Home} />
        <Route path="/talk" component={Talk} />
        <Route path="/session/precheck" component={PreCheck} />
        <Route path="/session/active" component={ActiveSession} />
        <Route path="/community/circle/:id" component={CommunityCircle} />
        <Route path="/journal" component={Journal} />
        <Route path="/journal/write" component={JournalWrite} />
        <Route path="/practice" component={Practices} />
        <Route path="/practice/breathe" component={Breathe} />
        <Route path="/practice/grounding/:id" component={Grounding} />
        <Route path="/practice/reflection" component={Reflection} />
        <Route path="/resources" component={Resources} />
        <Route path="/progress" component={Progress} />
        <Route path="/profile" component={Profile} />
        <Route path="/subscription" component={Subscription} />
        <Route path="/:rest*" component={Splash} />
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
