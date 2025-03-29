
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  type TrafficLightType = 'classic' | 'minimal' | 'digital' | 'emoji' | 'meter';
  const [trafficLightType, setTrafficLightType] = useState<TrafficLightType>('classic');
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

  // Get traffic light name based on type
  const getTrafficLightName = (type: TrafficLightType) => {
    switch (type) {
      case 'classic': return "Klassiek stoplicht";
      case 'minimal': return "Minimalistisch stoplicht";
      case 'digital': return "Digitale LED-ring";
      case 'emoji': return "Emoji-stoplicht";
      case 'meter': return "Energie-meter stoplicht";
    }
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
      case 'classic':
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
      case 'minimal':
        return (
          <div className="rounded-xl flex flex-col items-center justify-center p-4 gap-3 h-64 w-28 bg-black/10 dark:bg-black/30 border border-gray-300 dark:border-gray-600">
            <div
              className={cn(
                "w-full h-16 rounded-sm",
                isRed ? "bg-traffic-red" : "bg-traffic-red/20"
              )}
            />
            <div
              className={cn(
                "w-full h-16 rounded-sm",
                isYellow ? "bg-traffic-yellow" : "bg-traffic-yellow/20"
              )}
            />
            <div
              className={cn(
                "w-full h-16 rounded-sm",
                isGreen ? "bg-traffic-green" : "bg-traffic-green/20"
              )}
            />
          </div>
        );
      case 'digital':
        return (
          <div className="flex items-center justify-center w-48 h-48">
            <div className="relative rounded-full border-8 border-gray-800 dark:border-gray-700 w-40 h-40 flex items-center justify-center">
              <div 
                className={cn(
                  "absolute inset-0 rounded-full border-8",
                  isRed ? "border-traffic-red animate-pulse" : 
                  isYellow ? "border-traffic-yellow animate-pulse" : 
                  "border-traffic-green animate-pulse"
                )}
                style={{ borderRadius: "50%" }}
              />
              <div 
                className={cn(
                  "absolute inset-4 rounded-full",
                  isRed ? "bg-traffic-red/30" : 
                  isYellow ? "bg-traffic-yellow/30" : 
                  "bg-traffic-green/30"
                )}
              />
              <div 
                className={cn(
                  "relative z-10 rounded-full w-16 h-16 flex items-center justify-center",
                  isRed ? "bg-traffic-red" : 
                  isYellow ? "bg-traffic-yellow" : 
                  "bg-traffic-green" 
                )}
              >
                <div className="bg-white/20 rounded-full w-8 h-8" />
              </div>
            </div>
          </div>
        );
      case 'emoji':
        return (
          <div className="flex items-center justify-center w-40 h-64">
            <div className="text-8xl">
              {isRed ? '🚫' : isYellow ? '⚠️' : '✅'}
            </div>
          </div>
        );
      case 'meter':
        return (
          <div className="w-40 h-64 flex flex-col items-center justify-center">
            <div className="w-32 h-16 border-2 border-gray-800 dark:border-gray-600 rounded-lg overflow-hidden relative">
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-r from-traffic-red via-traffic-yellow to-traffic-green"
                )}
              />
              <div 
                className={cn(
                  "absolute top-0 bottom-0 bg-black/70 transition-all duration-500",
                  isRed ? "right-0 left-[30%]" : 
                  isYellow ? "right-0 left-[60%]" : 
                  "right-0 left-[90%]"
                )}
              />
              <div 
                className={cn(
                  "absolute top-0 bottom-0 w-1 bg-white transform translate-x-[-50%] transition-all duration-500",
                  isRed ? "left-[30%]" : 
                  isYellow ? "left-[60%]" : 
                  "left-[90%]"
                )}
              />
            </div>
            <div className="text-center mt-4 text-lg font-medium">
              {isRed ? 'Hoog' : isYellow ? 'Gemiddeld' : 'Laag'}
            </div>
          </div>
        );
    }
  };

  // Function to cycle to next traffic light type
  const cycleTrafficLightType = (direction: 'next' | 'previous') => {
    const types: TrafficLightType[] = ['classic', 'minimal', 'digital', 'emoji', 'meter'];
    const currentIndex = types.indexOf(trafficLightType);
    let nextIndex;
    
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % types.length;
    } else {
      nextIndex = (currentIndex - 1 + types.length) % types.length;
    }
    
    setTrafficLightType(types[nextIndex]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => cycleTrafficLightType('previous')}
        >
          <ArrowLeft className="h-4 w-4" />
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
          onClick={() => cycleTrafficLightType('next')}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center text-sm mb-3">
        {getTrafficLightName(trafficLightType)}
      </div>
      
      <div className={cn("mb-4", className)}>
        {renderTrafficLight()}
      </div>
      
      {/* Legend with dynamic color - with additional spacing from traffic light */}
      <div className="mt-4 text-center">
        <div className={cn("text-lg font-medium", getLegendColor())}>
          {isRed ? "Hoge Prijs" : isYellow ? "Gemiddelde Prijs" : "Lage Prijs"}
        </div>
      </div>
    </div>
  );
}
