
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SourceAttribution() {
  return (
    <Card className="glass-card w-full overflow-hidden">
      <CardContent className="p-4 flex items-center">
        <div className={cn("flex flex-col flex-1")}>
          <p className="text-sm font-medium">Stroomprijzen worden geleverd door:</p>
          <p className="text-xs text-muted-foreground mt-1">
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
