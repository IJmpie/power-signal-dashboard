
import { useEffect } from "react";
import NotificationSettings from "@/components/NotificationSettings";

export default function NotificationsPage() {
  useEffect(() => {
    document.title = "Meldingen - Stroomprijs Stoplicht";
  }, []);

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <header className="container flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-semibold">Meldingen</h1>
      </header>

      <main className="container py-4">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Ontvang meldingen wanneer de stroomprijs verandert naar jouw ingestelde drempelwaarden.
          </p>
          <NotificationSettings />
        </div>
      </main>
    </div>
  );
}
