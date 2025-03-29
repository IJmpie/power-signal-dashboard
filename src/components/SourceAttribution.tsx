
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SourceAttribution() {
  return (
    <Card className="glass-card w-full overflow-hidden">
      <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className={cn("flex flex-col flex-1")}>
          <p className="text-lg font-semibold text-foreground mb-2">Stroomprijzen worden geleverd door:</p>
          <p className="text-xs text-muted-foreground">
            Frank Energie biedt dynamische tarieven, waardoor je kunt besparen als je energie gebruikt wanneer de prijzen laag zijn. 
            Ze leveren 100% groene stroom en CO2-gecompenseerd gas. Daarnaast hebben ze een handige app die helpt je verbruik slim te beheren. 
            Dit maakt het een duurzame en vaak goedkopere keuze voor mensen die flexibel met hun energie omgaan.
          </p>
          <div className="mt-3 flex items-center">
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => window.open("https://frankenergie.nl/aanmelden?referral=PROMO-STR", "_blank")}>
              Word ook klant bij Frank Energie <ExternalLink size={14} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Alle prijzen zijn inclusief BTW, energiebelasting en netbeheerkosten
          </p>
        </div>
        <div className="flex-shrink-0">
          <img 
            src="/lovable-uploads/b555600b-e096-4564-9504-2c1ae9139d38.png" 
            alt="Frank Energie" 
            className="h-16 object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
}
