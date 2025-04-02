
import { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const { client } = useClerk();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Extract token from URL query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token") || "";

  const validatePassword = (password: string) => {
    // Minimaal 8 tekens, ten minste één hoofdletter, één cijfer en één speciaal teken
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("De wachtwoorden komen niet overeen");
      return;
    }

    if (!validatePassword(password)) {
      setError("Wachtwoord moet minimaal 8 tekens bevatten, waaronder een hoofdletter, een cijfer en een speciaal teken");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Use reset_password_email_code instead of email_code
      await client.signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        password,
        code: token,
      });

      toast.success("Wachtwoord is succesvol gereset!");
      navigate("/inloggen");
    } catch (err: any) {
      console.error("Wachtwoord reset error:", err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || "Er is een fout opgetreden bij het resetten van je wachtwoord.");
      } else {
        setError("Er is een fout opgetreden bij het resetten van je wachtwoord. De link is mogelijk verlopen.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[85vh] py-8">
      <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-md bg-card">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Wachtwoord resetten</h1>
          <p className="text-muted-foreground mt-2">Stel een nieuw wachtwoord in voor je account</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Nieuw wachtwoord</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? "Verbergen" : "Tonen"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimaal 8 tekens met minstens één hoofdletter, één cijfer en één speciaal teken.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? "Verbergen" : "Tonen"}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Bezig met resetten..." : "Wachtwoord resetten"}
          </Button>
        </form>
      </div>
    </div>
  );
}
