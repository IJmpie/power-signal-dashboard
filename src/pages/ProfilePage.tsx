
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Profiel - Stroomprijs Stoplicht";
    
    if (!user) {
      navigate("/login");
      return;
    }
    
    const fetchUserData = async () => {
      try {
        // Get user preferences if available
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (data) {
          setUserData(data);
        } else if (error && error.code !== 'PGRST116') {
          console.error("Error fetching user data:", error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, [user, navigate]);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      toast({
        title: "Uitloggen mislukt",
        description: "Er ging iets mis bij het uitloggen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <header className="container flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-semibold">Mijn profiel</h1>
      </header>

      <main className="container py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <UserCircle className="h-24 w-24 text-primary" />
              </div>
              <CardTitle className="text-center">
                {user?.email}
              </CardTitle>
              <CardDescription className="text-center">
                Account beheren
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Instellingen aanpassen
              </Button>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/notifications")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Notificaties beheren
              </Button>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleSignOut}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoading ? "Uitloggen..." : "Uitloggen"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
