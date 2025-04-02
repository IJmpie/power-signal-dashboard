
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if we're in development mode with no Clerk key
  const isDevelopment = import.meta.env.DEV;
  const hasClerkKey = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  
  // In development without a key, allow access to protected routes
  if (isDevelopment && !hasClerkKey) {
    console.warn("Bypassing authentication in development mode");
    return <>{children}</>;
  }

  // Normal authentication flow when Clerk is available
  try {
    const { isLoaded, isSignedIn } = useUser();
    const location = useLocation();

    if (!isLoaded) {
      // Loading state while Clerk is initializing
      return <div className="flex justify-center p-8">Laden...</div>;
    }

    if (!isSignedIn) {
      // Redirect to login if not signed in, and remember where they were trying to go
      return <Navigate to="/inloggen" state={{ from: location.pathname }} replace />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    // Fallback for any errors with Clerk
    return <div className="flex justify-center p-8">Er is een fout opgetreden met de authenticatie.</div>;
  }
}
