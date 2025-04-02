
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacybeleid</h1>
      
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">Laatst bijgewerkt: 1 juli 2023</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Verzamelde informatie</h2>
          <p>
            We verzamelen verschillende soorten informatie voor verschillende doeleinden om onze 
            dienst aan jou te leveren en te verbeteren.
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">Persoonlijke gegevens</h3>
          <p>
            Tijdens het gebruik van onze dienst kunnen we je vragen om ons bepaalde persoonlijk 
            identificeerbare informatie te verstrekken die kan worden gebruikt om contact met je 
            op te nemen of je te identificeren ("Persoonlijke Gegevens"). Persoonlijk identificeerbare 
            informatie kan omvatten, maar is niet beperkt tot:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>E-mailadres</li>
            <li>Voor- en achternaam</li>
            <li>Gebruiksgegevens</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Gebruik van gegevens</h2>
          <p>
            We gebruiken de verzamelde gegevens voor verschillende doeleinden:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Om onze dienst te leveren en te onderhouden</li>
            <li>Om je op de hoogte te stellen van wijzigingen in onze dienst</li>
            <li>Om je de mogelijkheid te bieden deel te nemen aan interactieve functies van onze dienst</li>
            <li>Om klantenservice te bieden</li>
            <li>Om analyses of waardevolle informatie te verzamelen zodat we onze dienst kunnen verbeteren</li>
            <li>Om fraude te monitoren en te voorkomen</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Beveiliging van gegevens</h2>
          <p>
            De veiligheid van je gegevens is belangrijk voor ons, maar onthoud dat geen enkele methode 
            van verzending via het internet of methode van elektronische opslag 100% veilig is. 
            Hoewel we ernaar streven commercieel aanvaardbare middelen te gebruiken om je persoonlijke 
            gegevens te beschermen, kunnen we de absolute veiligheid ervan niet garanderen.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Jouw rechten</h2>
          <p>
            Als je in de Europese Economische Ruimte (EER) woont, heb je bepaalde rechten met betrekking 
            tot gegevensbescherming. We streven ernaar redelijke stappen te nemen om je de mogelijkheid 
            te bieden om je persoonlijke gegevens te corrigeren, wijzigen, verwijderen of het gebruik 
            ervan te beperken.
          </p>
          <p>
            Je hebt het recht om toegang te krijgen tot de informatie die we over je hebben. Je hebt 
            ook het recht om te verzoeken dat we informatie die we over je hebben corrigeren of verwijderen.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
          <p>
            Als je vragen hebt over dit privacybeleid, neem dan contact met ons op via:
          </p>
          <p className="mt-2">
            E-mail: privacy@example.com
          </p>
        </section>
      </div>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Button onClick={() => window.history.back()} variant="outline">
          Terug
        </Button>
        <Link to="/voorwaarden">
          <Button variant="outline">
            Gebruikersvoorwaarden bekijken
          </Button>
        </Link>
      </div>
    </div>
  );
}
