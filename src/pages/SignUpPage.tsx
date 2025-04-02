
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
import { toast } from "sonner";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    // Minimaal 8 tekens, ten minste één hoofdletter, één cijfer en één speciaal teken
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");

    if (password !== confirmPassword) {
      setError("De wachtwoorden komen niet overeen");
      return;
    }

    if (!validatePassword(password)) {
      setError("Wachtwoord moet minimaal 8 tekens bevatten, waaronder een hoofdletter, een cijfer en een speciaal teken");
      return;
    }

    if (!acceptTerms) {
      setError("Je moet akkoord gaan met de gebruikersvoorwaarden en het privacybeleid");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Account succesvol aangemaakt!");
        navigate("/");
      } else {
        // Stuur verificatie e-mail naar gebruiker
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingVerification(true);
      }
    } catch (err: any) {
      console.error("Error tijdens registratie:", err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || "Er is een fout opgetreden bij het aanmaken van je account.");
        
        if (err.errors[0].code === "form_identifier_exists") {
          setError("Dit e-mailadres is al geregistreerd. Probeer in te loggen of gebruik een ander e-mailadres.");
        }
      } else {
        setError("Er is een fout opgetreden bij het aanmaken van je account.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !code) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("E-mailadres succesvol geverifieerd!");
        navigate("/");
      } else {
        console.error("Verificatie status:", result.status);
        setError("Verificatie mislukt. Probeer het opnieuw.");
      }
    } catch (err: any) {
      console.error("Verificatie error:", err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || "De verificatiecode is ongeldig of verlopen.");
      } else {
        setError("De verificatiecode is ongeldig of verlopen.");
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
          <h1 className="text-2xl font-bold">
            {pendingVerification ? "Verifieer je e-mailadres" : "Registreren"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {pendingVerification
              ? "We hebben een verificatiecode naar je e-mailadres gestuurd"
              : "Maak een account aan om toegang te krijgen"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!pendingVerification ? (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Voornaam</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                    placeholder="Voornaam"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Achternaam</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Achternaam"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
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
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms} 
                onCheckedChange={(checked) => 
                  setAcceptTerms(checked === true)
                } 
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ik ga akkoord met de{" "}
                <Link to="/voorwaarden" className="text-primary hover:underline">
                  gebruikersvoorwaarden
                </Link>{" "}
                en het{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  privacybeleid
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Bezig met registreren..." : "Registreren"}
            </Button>

            <div className="text-center text-sm">
              <p>
                Heb je al een account?{" "}
                <Link to="/inloggen" className="text-primary hover:underline font-medium">
                  Inloggen
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">Verificatiecode</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Voer je verificatiecode in"
                required
              />
              <p className="text-xs text-muted-foreground">
                Controleer je e-mail voor de verificatiecode die we hebben verstuurd
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Bezig met verifiëren..." : "Verifieer e-mailadres"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
