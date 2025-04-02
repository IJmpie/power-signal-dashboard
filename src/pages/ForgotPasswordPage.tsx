
import { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const { client } = useClerk();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await client.signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccess(true);
    } catch (err: any) {
      console.error("Wachtwoord herstel error:", err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || "Er is een fout opgetreden. Probeer het opnieuw.");
      } else {
        setError("Er is een fout opgetreden. Probeer het opnieuw.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[85vh] py-8">
      <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-md bg-card">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Wachtwoord vergeten</h1>
          <p className="text-muted-foreground mt-2">
            {success
              ? "We hebben je een e-mail gestuurd met instructies om je wachtwoord te herstellen."
              : "Voer je e-mailadres in om je wachtwoord te herstellen"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="naam@voorbeeld.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Bezig met verzenden..." : "Herstel wachtwoord"}
            </Button>

            <div className="text-center text-sm">
              <p>
                Herinner je je wachtwoord?{" "}
                <Link to="/inloggen" className="text-primary hover:underline font-medium">
                  Inloggen
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <Alert>
              <AlertDescription>
                We hebben een e-mail gestuurd naar {email} met instructies om je wachtwoord te herstellen.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
            >
              Probeer opnieuw met een ander e-mailadres
            </Button>
            <div className="text-center text-sm">
              <p>
                Herinner je je wachtwoord?{" "}
                <Link to="/inloggen" className="text-primary hover:underline font-medium">
                  Inloggen
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
