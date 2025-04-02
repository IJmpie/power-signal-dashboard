
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import MobileNavBar from "./MobileNavBar";
import DesktopNavBar from "./DesktopNavBar";
import { useIsMobile } from "@/hooks/use-mobile";

interface GuestLayoutProps {
  children?: React.ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Als de route niet toegestaan is voor gasten, doorverwijzen naar de welkomstpagina
  const allowedRoutes = ["/", "/prices", "/gast"];
  if (!allowedRoutes.includes(location.pathname) && location.pathname !== "/gast") {
    return <Navigate to="/welkom" replace />;
  }

  return (
    <>
      {!isMobile && <DesktopNavBar guestMode={true} />}
      {children || <Outlet />}
      {isMobile && <MobileNavBar guestMode={true} />}
    </>
  );
}
