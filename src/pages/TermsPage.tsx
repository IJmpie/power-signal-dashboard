
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gebruikersvoorwaarden</h1>
      
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">Laatst bijgewerkt: 1 juli 2023</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Algemene voorwaarden</h2>
          <p>
            Door gebruik te maken van onze diensten ga je akkoord met deze voorwaarden. 
            Lees ze zorgvuldig door. Door toegang te krijgen tot of gebruik te maken van 
            onze website en diensten, stem je ermee in gebonden te zijn aan deze voorwaarden.
          </p>
          <p>
            Als je niet akkoord gaat met deze voorwaarden, mag je geen toegang krijgen tot of 
            gebruik maken van onze diensten.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Gebruiksvoorwaarden</h2>
          <p>
            Onze diensten zijn beschikbaar voor personen van 18 jaar of ouder. 
            Door gebruik te maken van onze diensten, verklaar je dat je 18 jaar of ouder bent.
          </p>
          <p>
            Je bent verantwoordelijk voor het handhaven van de vertrouwelijkheid van je 
            accountgegevens, inclusief je wachtwoord, en voor alle activiteiten die plaatsvinden 
            onder je account.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Wijzigingen in voorwaarden</h2>
          <p>
            We behouden ons het recht voor om deze voorwaarden op elk moment te wijzigen of aan te vullen.
            Het is jouw verantwoordelijkheid om deze voorwaarden regelmatig te controleren op wijzigingen.
            Je voortgezette gebruik van onze diensten na het plaatsen van wijzigingen betekent dat je 
            de nieuwe voorwaarden accepteert.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Beëindiging</h2>
          <p>
            We kunnen je toegang tot onze diensten onmiddellijk beëindigen of opschorten, zonder 
            voorafgaande kennisgeving of aansprakelijkheid, om welke reden dan ook, inclusief, zonder 
            beperking, als je deze voorwaarden schendt.
          </p>
          <p>
            Bij beëindiging vervalt je recht om onze diensten te gebruiken onmiddellijk.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Disclaimer</h2>
          <p>
            Onze diensten worden geleverd 'zoals ze zijn' en 'zoals beschikbaar' zonder enige garanties, 
            expliciet of impliciet, inclusief maar niet beperkt tot garanties van verkoopbaarheid, 
            geschiktheid voor een bepaald doel, of niet-inbreuk.
          </p>
        </section>
      </div>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Button onClick={() => window.history.back()} variant="outline">
          Terug
        </Button>
        <Link to="/privacy">
          <Button variant="outline">
            Privacybeleid bekijken
          </Button>
        </Link>
      </div>
    </div>
  );
}
