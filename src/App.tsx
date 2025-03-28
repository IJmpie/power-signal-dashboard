
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
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

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

const App = () => {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if Supabase is properly configured
    supabase.auth.getSession().catch((error) => {
      console.error("Supabase configuration error:", error);
      setIsSupabaseConfigured(false);
    });
  }, []);
  
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 text-2xl font-bold">Supabase Configuration Needed</h1>
        <p className="mb-8">
          Please configure your Supabase URL and Anon Key in the environment variables.
          <br />
          Set <code className="bg-gray-100 px-2 py-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-gray-100 px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code>
        </p>
        
        <div className="max-w-md text-left bg-amber-50 p-4 rounded border border-amber-200">
          <p className="font-medium text-amber-800">For development purposes:</p>
          <p className="mt-2 text-sm">
            1. Create a Supabase project at <a href="https://supabase.com" className="text-blue-600 underline" target="_blank" rel="noopener">supabase.com</a><br />
            2. Get your project URL and anon key from the API settings<br />
            3. Update these values in src/lib/supabase.ts
          </p>
        </div>
      </div>
    );
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
