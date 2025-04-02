
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MobileNavBar from "./components/MobileNavBar";
import DesktopNavBar from "./components/DesktopNavBar";
import PricesPage from "./pages/PricesPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import FrankEnergiePage from "./pages/FrankEnergiePage";
import ESP32DashboardPage from "./pages/ESP32DashboardPage";
import { useIsMobile } from "@/hooks/use-mobile";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomePage from "./pages/WelcomePage";
import GuestLayout from "./components/GuestLayout";

// Get the Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isDevelopment = import.meta.env.DEV;

// Create a new query client for React Query
const queryClient = new QueryClient();

// Conditionally import ClerkProvider to avoid errors in development mode
let ClerkProvider;
try {
  // Dynamic import to allow app to continue loading if Clerk is not properly configured
  ClerkProvider = isDevelopment && !PUBLISHABLE_KEY 
    ? ({ children }) => <>{children}</> 
    : require("@clerk/clerk-react").ClerkProvider;
} catch (e) {
  console.warn("Clerk provider not available, falling back to regular rendering");
  ClerkProvider = ({ children }) => <>{children}</>;
}

// Component for app content that doesn't depend on Clerk
const AppContent = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Routes>
        {/* Welkom pagina als startpunt */}
        <Route path="/welkom" element={<WelcomePage />} />
        
        {/* Route voor gastgebruikers */}
        <Route path="/gast" element={<GuestLayout />}>
          <Route index element={<Navigate to="/" replace />} />
          <Route path="/" element={<Index />} />
          <Route path="/prices" element={<PricesPage />} />
        </Route>
        
        {/* Beschermde routes die authenticatie vereisen */}
        <Route path="/" element={
          <>
            {!isMobile && <DesktopNavBar />}
            <Outlet />
            {isMobile && <MobileNavBar />}
          </>
        }>
          <Route index element={
            isDevelopment && !PUBLISHABLE_KEY 
              ? <Index /> 
              : <ProtectedRoute><Index /></ProtectedRoute>
          } />
          <Route path="/prices" element={
            isDevelopment && !PUBLISHABLE_KEY 
              ? <PricesPage /> 
              : <ProtectedRoute><PricesPage /></ProtectedRoute>
          } />
          <Route path="/notifications" element={
            isDevelopment && !PUBLISHABLE_KEY 
              ? <NotificationsPage /> 
              : <ProtectedRoute><NotificationsPage /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            isDevelopment && !PUBLISHABLE_KEY 
              ? <SettingsPage /> 
              : <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />
          <Route path="/frankenergie" element={
            isDevelopment && !PUBLISHABLE_KEY 
              ? <FrankEnergiePage /> 
              : <ProtectedRoute><FrankEnergiePage /></ProtectedRoute>
          } />
          <Route path="/esp32" element={
            isDevelopment && !PUBLISHABLE_KEY 
              ? <ESP32DashboardPage /> 
              : <ProtectedRoute><ESP32DashboardPage /></ProtectedRoute>
          } />
          <Route path="/profiel" element={
            isDevelopment && !PUBLISHABLE_KEY 
              ? <ProfilePage /> 
              : <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
        </Route>
        
        {/* Authenticatie routes */}
        <Route path="/inloggen" element={<SignInPage />} />
        <Route path="/registreren" element={<SignUpPage />} />
        <Route path="/wachtwoord-vergeten" element={<ForgotPasswordPage />} />
        <Route path="/wachtwoord-resetten" element={<ResetPasswordPage />} />
        
        {/* Algemene pagina's */}
        <Route path="/voorwaarden" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
        {/* Redirect root naar welkom */}
        <Route path="/" element={<Navigate to="/welkom" replace />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// Main App component
const App = () => {
  // If in development and no key is provided, render without Clerk
  if (isDevelopment && !PUBLISHABLE_KEY) {
    console.warn(
      "No Clerk publishable key found. Running in development mode without authentication. " +
      "To enable authentication features, set VITE_CLERK_PUBLISHABLE_KEY in your environment."
    );
    
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Regular rendering with Clerk when key is available
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/inloggen"
      signUpUrl="/registreren"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/welkom"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
