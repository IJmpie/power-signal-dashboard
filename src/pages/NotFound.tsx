
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <div className="glass-card p-10 text-center max-w-md">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Deze pagina bestaat niet
        </p>
        <Button asChild>
          <a href="/" className="flex items-center gap-2">
            <Home size={18} /> Terug naar Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
