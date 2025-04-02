
import { BarChart2, Settings, Bell, TrafficCone, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileNavBarProps {
  guestMode?: boolean;
}

export default function MobileNavBar({ guestMode = false }: MobileNavBarProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-background z-50">
      <div className="flex items-center justify-around p-3">
        <NavItem 
          href={guestMode ? "/gast" : "/"} 
          icon={<TrafficCone size={20} />} 
          label="Stoplicht" 
          active={location.pathname === (guestMode ? "/gast" : "/")}
        />
        <NavItem 
          href={guestMode ? "/gast/prices" : "/prices"} 
          icon={<BarChart2 size={20} />} 
          label="Prijzen" 
          active={location.pathname === (guestMode ? "/gast/prices" : "/prices")}
        />
        {!guestMode ? (
          <>
            <NavItem 
              href="/notifications" 
              icon={<Bell size={20} />} 
              label="Meldingen" 
              active={location.pathname === "/notifications"}
            />
            <NavItem 
              href="/frankenergie" 
              icon={<img 
                src="/lovable-uploads/b555600b-e096-4564-9504-2c1ae9139d38.png" 
                alt="Frank" 
                className="w-5 h-5 object-contain grayscale"
              />} 
              label="Frank" 
              active={location.pathname === "/frankenergie"}
            />
            <NavItem 
              href="/settings" 
              icon={<Settings size={20} />} 
              label="Instellingen" 
              active={location.pathname === "/settings"}
            />
          </>
        ) : (
          <NavItem 
            href="/welkom" 
            icon={<LogIn size={20} />} 
            label="Inloggen" 
            active={false}
          />
        )}
      </div>
    </div>
  );
}

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex flex-col items-center justify-center space-y-1",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
