
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Bell, Settings, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function MobileNavBar() {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const navItems = [
    { name: 'Startpagina', path: '/', icon: Home },
    { name: 'Prijzen', path: '/prices', icon: BarChart2 },
    { name: 'Meldingen', path: '/notifications', icon: Bell },
    { name: 'Instellingen', path: '/settings', icon: Settings },
    { name: 'Profiel', path: '/profile', icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-background py-2 md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "flex flex-col items-center justify-center px-2 py-1 text-xs",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
