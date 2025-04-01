
import { BarChart2, Settings, Bell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export default function DesktopNavBar() {
  const location = useLocation();
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-background">
      <div className="container flex items-center justify-end p-2 gap-4">
        <NavItem 
          href="/" 
          icon={<Zap size={20} />} 
          label="Stoplicht" 
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
        "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent",
        active ? "text-primary font-medium" : "text-muted-foreground"
      )}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}
