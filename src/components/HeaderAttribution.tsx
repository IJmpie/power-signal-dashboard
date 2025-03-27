
import { cn } from "@/lib/utils";

export default function HeaderAttribution() {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/lovable-uploads/b555600b-e096-4564-9504-2c1ae9139d38.png" 
        alt="Frank Energie" 
        className="h-8 object-contain"
      />
      <span className="text-sm font-medium">Prijzen door Frank Energie</span>
    </div>
  );
}
