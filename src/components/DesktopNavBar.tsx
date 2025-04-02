
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { BarChart2, Settings, Bell, TrafficCone, LogIn } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface DesktopNavBarProps {
  guestMode?: boolean;
}

export default function DesktopNavBar({ guestMode = false }: DesktopNavBarProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  if (isMobile) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 border-b border-gray-200 dark:border-gray-800 bg-background z-50 h-14">
      <div className="container flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <NavItem 
            href="/" 
            icon={<TrafficCone size={20} />} 
            label="Stoplicht" 
            active={location.pathname === "/"} 
          />
          <NavItem 
            href="/prices" 
            icon={<BarChart2 size={20} />} 
            label="Prijzen" 
            active={location.pathname === "/prices"} 
          />
          {!guestMode && (
            <>
              <NavItem 
                href="/notifications" 
                icon={<Bell size={20} />} 
                label="Meldingen" 
                active={location.pathname === "/notifications"} 
              />
              <NavItem 
                href="/esp32" 
                icon={<TrafficCone size={20} />} 
                label="ESP32 Dashboard" 
                active={location.pathname === "/esp32"} 
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!guestMode ? (
            <>
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
              <ThemeToggle />
            </>
          ) : (
            <>
              <NavItem 
                href="/welkom" 
                icon={<LogIn size={20} />} 
                label="Inloggen" 
                active={false} 
              />
              <ThemeToggle />
            </>
          )}
        </div>
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
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
      )}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
