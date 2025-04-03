
import { BarChart2, Settings, Bell } from "lucide-react";
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
          icon={<StoplichtIcon size={20} />} 
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
          icon={<FrankIcon size={20} />} 
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

// Custom StoplichtIcon component
function StoplichtIcon({ size = 24, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <rect x="6" y="3" width="12" height="18" rx="6" strokeWidth="2" />
      <circle cx="12" cy="7" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="17" r="2" fill="currentColor" />
    </svg>
  );
}

// Custom Frank Icon component
function FrankIcon({ size = 24, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 8h7m-7 4h5" />
      <path d="M6 18v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8" />
      <path d="M6 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2" />
    </svg>
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
