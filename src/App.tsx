
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MobileNavBar from "./components/MobileNavBar";
import PricesPage from "./pages/PricesPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { isSupabaseReady } from "./lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Laden...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Supabase configuration error message
const SupabaseConfigError = () => (
  <div className="flex min-h-screen items-center justify-center p-4">
    <Alert className="max-w-md">
      <AlertTitle className="text-red-500">Supabase configuratie ontbreekt</AlertTitle>
      <AlertDescription>
        <p className="mt-2">
          Deze applicatie vereist een geldige Supabase configuratie om te werken.
          Voeg de volgende omgevingsvariabelen toe in uw Lovable project:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>VITE_SUPABASE_URL</li>
          <li>VITE_SUPABASE_ANON_KEY</li>
        </ul>
        <p className="mt-2">
          Je kunt deze waarden vinden in je Supabase project dashboard onder "Project Settings" &gt; "API".
        </p>
      </AlertDescription>
    </Alert>
  </div>
);

const App = () => {
  // If Supabase is not configured, show configuration error
  if (!isSupabaseReady) {
    return <SupabaseConfigError />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/prices" element={<ProtectedRoute><PricesPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNavBar />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
