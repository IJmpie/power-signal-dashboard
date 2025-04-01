
import { cn } from "@/lib/utils";

type HeaderAttributionProps = {
  className?: string;
  compact?: boolean;
};

export default function HeaderAttribution({ className, compact = false }: HeaderAttributionProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/lovable-uploads/b555600b-e096-4564-9504-2c1ae9139d38.png" 
        alt="Frank Energie" 
        className={cn("object-contain", compact ? "h-12" : "h-16")}
      />
      {!compact && (
        <span className="text-sm font-medium">Prijzen door Frank Energie</span>
      )}
    </div>
  );
}
