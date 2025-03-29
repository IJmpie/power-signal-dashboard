
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FrankEnergiePage() {
  useEffect(() => {
    document.title = "Frank Energie - Stroomprijs Stoplicht";
  }, []);

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <header className="container flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Frank Energie</h1>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <main className="container py-6">
          <div className="space-y-8">
            <section className="text-center">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Profiteer van Dynamische Energieprijzen
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Betaal de actuele marktprijs voor jouw energie, zonder verborgen kosten of winstmarges
              </p>
            </section>

            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-green-500 p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Word Klant van Frank Energie</h2>
                <p className="mb-4">Profiteer direct van voordelige dynamische prijzen voor stroom en gas</p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <a 
                    href="https://www.frankenergie.nl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Direct Aanmelden <ExternalLink size={16} />
                  </a>
                </Button>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Waarom Frank Energie?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mt-0.5">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="font-medium">Dynamische prijzen</span>
                      <p className="text-muted-foreground text-sm">Profiteer van lage prijzen wanneer er veel duurzame energie beschikbaar is</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mt-0.5">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="font-medium">100% Nederlandse groene stroom</span>
                      <p className="text-muted-foreground text-sm">Duurzaam en lokaal opgewekt voor een betere toekomst</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mt-0.5">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="font-medium">Eerlijke en transparante tarieven</span>
                      <p className="text-muted-foreground text-sm">Geen verborgen kosten, geen winstmarge op de inkoop van energie</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mt-0.5">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="font-medium">Gemakkelijk inzicht via app</span>
                      <p className="text-muted-foreground text-sm">Volg je verbruik en bespaar door slim om te gaan met je energie</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Zo werkt het</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-10 h-10 flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Meld je aan</h3>
                    <p className="text-muted-foreground">
                      Registreer in enkele minuten op de website van Frank Energie. Alleen je adres en verbruik zijn nodig.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-10 h-10 flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">2</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Frank regelt alles</h3>
                    <p className="text-muted-foreground">
                      Frank regelt de overstap van je huidige leverancier volledig voor je. Je hoeft zelf niets op te zeggen.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-10 h-10 flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">3</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Geniet en bespaar</h3>
                    <p className="text-muted-foreground">
                      Gebruik onze app samen met de Frank app om slim gebruik te maken van de laagste energieprijzen.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <div className="flex justify-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-500 text-white hover:opacity-90">
                <a 
                  href="https://www.frankenergie.nl/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Word klant van Frank Energie <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
}
