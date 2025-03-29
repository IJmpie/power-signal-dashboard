
import { Home, BarChart2, Settings, Bell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MobileNavBar() {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-background z-50">
      <div className="flex items-center justify-around p-3">
        <NavItem 
          href="/" 
          icon={<Home size={20} />} 
          label="Home" 
          active={location.pathname === "/"}
        />
        <NavItem 
          href="/prices" 
          icon={<BarChart2 size={20} />} 
          label="Prijzen" 
          active={location.pathname === "/prices"}
        />
        <NavItem 
          href="/notifications" 
          icon={<Bell size={20} />} 
          label="Meldingen" 
          active={location.pathname === "/notifications"}
        />
        <NavItem 
          href="/frankenergie" 
          icon={<Zap size={20} />} 
          label="Frank" 
          active={location.pathname === "/frankenergie"}
        />
        <NavItem 
          href="/settings" 
          icon={<Settings size={20} />} 
          label="Instellingen" 
          active={location.pathname === "/settings"}
        />
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
