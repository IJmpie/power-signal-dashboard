
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, Globe } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <Card className="w-[90%] max-w-md glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welkom bij Stroomprijs Stoplicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Log in, registreer of ga verder als gast met beperkte toegang.
          </p>
          
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              <Link to="/inloggen" className="flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Inloggen</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/registreren" className="flex items-center justify-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Registreren</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" className="w-full">
              <Link to="/gast" className="flex items-center justify-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Doorgaan als gast</span>
              </Link>
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground pt-4">
            Als gast heb je alleen toegang tot het stoplicht en prijzen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
