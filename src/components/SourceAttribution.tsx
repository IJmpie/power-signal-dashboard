
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SourceAttribution() {
  return (
    <Card className="glass-card w-full overflow-hidden">
      <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className={cn("flex flex-col flex-1")}>
          <p className="text-sm font-medium mb-2">Stroomprijzen worden geleverd door:</p>
          <p className="text-xs text-muted-foreground">
            Frank Energie biedt dynamische tarieven, waardoor je kunt besparen als je energie gebruikt wanneer de prijzen laag zijn. 
            Ze leveren 100% groene stroom en CO2-gecompenseerd gas. Daarnaast hebben ze een handige app die helpt je verbruik slim te beheren. 
            Dit maakt het een duurzame en vaak goedkopere keuze voor mensen die flexibel met hun energie omgaan.
          </p>
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
