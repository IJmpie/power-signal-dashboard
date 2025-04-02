
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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
}
