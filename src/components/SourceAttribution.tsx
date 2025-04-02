
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink, Leaf, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SourceAttribution() {
  return (
    <Card className="glass-card w-full overflow-hidden">
      <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className={cn("flex flex-col flex-1")}>
          <div className="border-l-4 border-primary pl-4 py-2 my-3">
            <h3 className="text-xl font-bold text-primary mb-3">Word klant bij Frank Energie!</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="flex items-start gap-2">
                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm">Bespaar op je energiekosten door slim gebruik te maken van dynamische tarieven</p>
              </div>
              <div className="flex items-start gap-2">
                <Leaf className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-sm">100% groene stroom en CO2-gecompenseerd gas voor een duurzame toekomst</p>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-sm">Betrouwbare service met handige app om je verbruik te monitoren</p>
              </div>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold flex items-center gap-1 mt-1" onClick={() => window.open("https://frankenergie.nl/aanmelden?referral=PROMO-STR", "_blank")}>
              Word ook klant bij Frank Energie <ExternalLink size={16} />
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
            className="h-20 object-contain grayscale"
          />
        </div>
      </CardContent>
    </Card>
  );
}
