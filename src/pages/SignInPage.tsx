
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Succesvol ingelogd!");
        navigate("/");
      } else {
        console.error("Sign-in status:", result.status);
        setError("Er is een onverwachte fout opgetreden tijdens het inloggen.");
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      if (err.errors && err.errors.length > 0) {
        setError(
          err.errors[0].message || "Ongeldige e-mail of wachtwoord. Probeer het opnieuw."
        );
      } else {
        setError("Ongeldige e-mail of wachtwoord. Probeer het opnieuw.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="flex justify-center p-8">Laden...</div>;
  }

  return (
    <div className="container flex items-center justify-center min-h-[85vh] py-8">
      <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-md bg-card">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Inloggen</h1>
          <p className="text-muted-foreground mt-2">
            Log in om toegang te krijgen tot je account
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="naam@voorbeeld.nl"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Wachtwoord</Label>
              <Link
                to="/wachtwoord-vergeten"
                className="text-sm text-primary hover:underline"
              >
                Wachtwoord vergeten?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Bezig met inloggen..." : "Inloggen"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p>
            Nog geen account?{" "}
            <Link to="/registreren" className="text-primary hover:underline font-medium">
              Maak een account aan
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
