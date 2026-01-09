
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { NavbarProvider } from "@/context/NavbarContext";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Stats from "@/pages/Stats";
import Leaderboard from "@/pages/Leaderboard";
import Journal from "@/pages/Journal";
import Mood from "@/pages/Mood";
import Profile from "@/pages/Profile";
import NotFound from "./pages/NotFound";
import CalmingRoom from "@/pages/CalmingRoom";
import Breathing from "@/pages/Breathing";
import Habits from "@/pages/Habits";
import Therapists from "@/pages/Therapists";
import Appointment from "@/pages/Appointment";
import SecureChat from "@/pages/SecureChat";
import AiChat from "@/pages/AiChat";
import Resources from "@/pages/Resources";
import { useNavbar } from "@/context/NavbarContext";

const queryClient = new QueryClient();

// This component will manage the navbar visibility based on current route
const NavbarVisibilityManager = () => {
  const location = useLocation();
  const { setNavbarVisible } = useNavbar();
  
  useEffect(() => {
    // Main tabs where navbar should be visible
    const mainRoutes = ['/', '/stats', '/leaderboard', '/profile'];
    const isMainRoute = mainRoutes.includes(location.pathname);
    
    // Show navbar only on main routes
    setNavbarVisible(isMainRoute);
  }, [location.pathname, setNavbarVisible]);
  
  return null;
};

const AppContent = () => {
  return (
    <>
      <NavbarVisibilityManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calming-room" element={<CalmingRoom />} />
        <Route path="/breathing" element={<Breathing />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/therapists" element={<Therapists />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/secure-chat" element={<SecureChat />} />
        <Route path="/ai-chat" element={<AiChat />} />
        <Route path="/resources" element={<Resources />} />
        
        {/* Remove redirects to unused routes */}
        <Route path="/professional" element={<Navigate to="/therapists" replace />} />
        
        {/* 404 page for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Navbar />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavbarProvider>
          <AppContent />
        </NavbarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
