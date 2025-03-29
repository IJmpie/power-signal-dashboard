
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

type TrafficLightProps = {
  currentPrice: number;
  className?: string;
  customThresholds?: {
    high: number;
    medium: number;
    low: number;
  };
};

// Create audio context for sound effects
let audioContext: AudioContext | null = null;
if (typeof window !== 'undefined') {
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch (e) {
    console.error("Web Audio API not supported", e);
  }
}

// Function to play a sound when traffic light changes
const playTrafficLightSound = (frequency: number) => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency; // Red: high frequency, Yellow: medium, Green: low
  gainNode.gain.value = 0.1; // Volume
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
  oscillator.stop(audioContext.currentTime + 0.5);
};

export default function TrafficLight({ 
  currentPrice, 
  className,
  customThresholds = { high: 0.40, medium: 0.25, low: 0.15 }
}: TrafficLightProps) {
  const [trafficLightType, setTrafficLightType] = useState<'default' | 'modern' | 'minimal'>('default');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastState, setLastState] = useState<'red' | 'yellow' | 'green' | null>(null);

  const isRed = currentPrice >= customThresholds.high;
  const isYellow = currentPrice >= customThresholds.medium && currentPrice < customThresholds.high;
  const isGreen = currentPrice < customThresholds.medium;

  const getLegendColor = () => {
    if (isRed) return "text-traffic-red";
    if (isYellow) return "text-traffic-yellow";
    return "text-traffic-green";
  };

  // Play sound when traffic light state changes
  useEffect(() => {
    if (!soundEnabled) return;
    
    const currentState = isRed ? 'red' : isYellow ? 'yellow' : 'green';
    
    if (lastState !== null && lastState !== currentState) {
      if (currentState === 'red') {
        playTrafficLightSound(880); // A5
      } else if (currentState === 'yellow') {
        playTrafficLightSound(659.25); // E5
      } else {
        playTrafficLightSound(523.25); // C5
      }
    }
    
    setLastState(currentState);
  }, [isRed, isYellow, isGreen, soundEnabled]);

  const renderTrafficLight = () => {
    switch (trafficLightType) {
      case 'modern':
        return (
          <div className="rounded-xl flex flex-col items-center justify-center p-4 bg-black/80 h-64 w-24">
            <div
              className={cn(
                "w-16 h-16 rounded-full mb-4",
                isRed ? "bg-traffic-red animate-pulse" : "bg-traffic-red/30"
              )}
            />
            <div
              className={cn(
                "w-16 h-16 rounded-full mb-4",
                isYellow ? "bg-traffic-yellow animate-pulse" : "bg-traffic-yellow/30"
              )}
            />
            <div
              className={cn(
                "w-16 h-16 rounded-full",
                isGreen ? "bg-traffic-green animate-pulse" : "bg-traffic-green/30"
              )}
            />
          </div>
        );
      case 'minimal':
        return (
          <div className="flex items-center justify-center w-20 h-64">
            <div 
              className={cn(
                "w-20 h-20 rounded-full border-4",
                isRed ? "bg-traffic-red border-white animate-pulse" : 
                isYellow ? "bg-traffic-yellow border-white animate-pulse" : 
                "bg-traffic-green border-white animate-pulse"
              )}
            />
          </div>
        );
      default:
        return (
          <div className={cn(
            "traffic-light-container rounded-xl py-6 px-3 flex flex-col items-center justify-center gap-4 shadow-xl border-2 border-gray-700 dark:border-gray-500 scale-110 transform hover:scale-115 transition-transform duration-300",
            "relative overflow-hidden"
          )}>
            {/* Background glow effect */}
            <div className={cn(
              "absolute inset-0 opacity-20 z-0",
              isRed ? "bg-traffic-red" : isYellow ? "bg-traffic-yellow" : "bg-traffic-green"
            )} />
            
            {/* Traffic lights */}
            <div
              className={cn(
                "traffic-light rounded-full relative z-10",
                isRed ? "traffic-light-active bg-traffic-red" : "traffic-light-inactive bg-traffic-red/50",
                isRed && "ring-4 ring-traffic-red/30"
              )}
              style={{ "--glow-color-rgb": "255, 59, 48" } as React.CSSProperties}
            />
            <div
              className={cn(
                "traffic-light rounded-full relative z-10",
                isYellow ? "traffic-light-active bg-traffic-yellow" : "traffic-light-inactive bg-traffic-yellow/50",
                isYellow && "ring-4 ring-traffic-yellow/30"
              )}
              style={{ "--glow-color-rgb": "255, 204, 0" } as React.CSSProperties}
            />
            <div
              className={cn(
                "traffic-light rounded-full relative z-10",
                isGreen ? "traffic-light-active bg-traffic-green" : "traffic-light-inactive bg-traffic-green/50",
                isGreen && "ring-4 ring-traffic-green/30"
              )}
              style={{ "--glow-color-rgb": "52, 199, 89" } as React.CSSProperties}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-2 mb-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => {
            const types: ('default' | 'modern' | 'minimal')[] = ['default', 'modern', 'minimal'];
            const currentIndex = types.indexOf(trafficLightType);
            const nextIndex = (currentIndex + 2) % types.length; // +2 because we're using ArrowUp to go back
            setTrafficLightType(types[nextIndex]);
          }}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button 
          variant={soundEnabled ? "default" : "outline"}
          size="icon" 
          className="h-8 w-8" 
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => {
            const types: ('default' | 'modern' | 'minimal')[] = ['default', 'modern', 'minimal'];
            const currentIndex = types.indexOf(trafficLightType);
            const nextIndex = (currentIndex + 1) % types.length;
            setTrafficLightType(types[nextIndex]);
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
      
      <div className={className}>
        {renderTrafficLight()}
      </div>
      
      {/* Legend with dynamic color */}
      <div className="mt-4 text-center">
        <div className={cn("text-lg font-medium", getLegendColor())}>
          {isRed ? "Hoge Prijs" : isYellow ? "Gemiddelde Prijs" : "Lage Prijs"}
        </div>
      </div>
    </div>
  );
}
