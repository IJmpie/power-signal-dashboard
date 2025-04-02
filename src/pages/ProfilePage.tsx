
import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User, Mail } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isUserLoaded || !user) {
    return (
      <div className="container py-8 text-center">
        <p>Je moet ingelogd zijn om deze pagina te bekijken.</p>
        <Button onClick={() => navigate("/inloggen")} className="mt-4">
          Inloggen
        </Button>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await user.update({
        firstName,
        lastName,
      });
      setSuccess(true);
      toast.success("Profiel succesvol bijgewerkt");
    } catch (err: any) {
      console.error("Profiel update error:", err);
      setError(
        err.errors?.[0]?.message || "Er is een fout opgetreden bij het bijwerken van je profiel."
      );
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    // Minimaal 8 tekens, ten minste één hoofdletter, één cijfer en één speciaal teken
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("De nieuwe wachtwoorden komen niet overeen");
      setLoading(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Het nieuwe wachtwoord moet minimaal 8 tekens bevatten, waaronder een hoofdletter, een cijfer en een speciaal teken"
      );
      setLoading(false);
      return;
    }

    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
      });
      
      setSuccess(true);
      toast.success("Wachtwoord succesvol gewijzigd");
      setShowPasswordSection(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Wachtwoord update error:", err);
      if (err.errors && err.errors.length > 0 && err.errors[0].code === "form_password_incorrect") {
        setError("Huidig wachtwoord is onjuist");
      } else {
        setError(
          err.errors?.[0]?.message || "Er is een fout opgetreden bij het wijzigen van je wachtwoord."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      await user.delete();
      toast.success("Je account is succesvol verwijderd.");
      navigate("/");
    } catch (err: any) {
      console.error("Account verwijder error:", err);
      toast.error(
        err.errors?.[0]?.message || "Er is een fout opgetreden bij het verwijderen van je account."
      );
    }
  };

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mijn Profiel</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertDescription>Je profiel is succesvol bijgewerkt.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Persoonlijke gegevens</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Voornaam</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Achternaam</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  value={user.emailAddresses[0]?.emailAddress || ""}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Om je e-mailadres te wijzigen, neem contact op met support.
              </p>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Bezig met bijwerken..." : "Profiel bijwerken"}
            </Button>
          </form>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Wachtwoord wijzigen</h2>
          
          {!showPasswordSection ? (
            <Button onClick={() => setShowPasswordSection(true)}>
              Wijzig wachtwoord
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Huidig wachtwoord</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimaal 8 tekens met minstens één hoofdletter, één cijfer en één speciaal teken.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bevestig nieuw wachtwoord</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
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
              
              <div className="space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Bezig met bijwerken..." : "Wachtwoord wijzigen"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                >
                  Annuleren
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          
          <div className="space-y-4">
            <Button onClick={handleLogout} variant="outline">
              Uitloggen
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Account verwijderen</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Weet je zeker dat je je account wilt verwijderen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deze actie kan niet ongedaan worden gemaakt. Hiermee worden al je persoonlijke gegevens permanent verwijderd.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Account verwijderen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
