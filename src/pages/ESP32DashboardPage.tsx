
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ESP32ConfigCard, { ESP32Device } from "@/components/ESP32ConfigCard";
import PriceThresholdSettings from "@/components/PriceThresholdSettings";
import { getThresholds, updateThresholds } from "@/services/esp32ApiService";
import HeaderAttribution from "@/components/HeaderAttribution";
import { API_BASE_URL } from "@/services/esp32ApiService";

export default function ESP32DashboardPage() {
  // For demonstration, using static device data
  const [devices, setDevices] = useState<ESP32Device[]>([
    { id: "ESP32-TL-001", name: "Stoplicht Woonkamer", connected: true, lastSeen: new Date(), batteryLevel: 85, wifiStrength: -65 },
    { id: "ESP32-TL-002", name: "Stoplicht Kantoor", connected: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3) } // 3 hours ago
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("devices");
  const [thresholds, setThresholds] = useState({ high: 0.40, medium: 0.25, low: 0.15 });
  
  // Load thresholds from API
  useEffect(() => {
    const loadThresholds = async () => {
      const apiThresholds = await getThresholds();
      if (apiThresholds) {
        setThresholds(apiThresholds);
      }
    };
    
    loadThresholds();
  }, []);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call to refresh device status
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Status bijgewerkt");
    }, 1000);
  };
  
  const handleThresholdsChange = async (high: number, low: number, medium?: number) => {
    // Use provided medium or calculate it
    const mediumValue = medium !== undefined ? medium : (high + low) / 2;
    const newThresholds = { high, medium: mediumValue, low };
    
    const success = await updateThresholds(newThresholds);
    if (success) {
      setThresholds(newThresholds);
      localStorage.setItem('priceThresholds', JSON.stringify(newThresholds));
    }
  };
  
  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <header className="container flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">ESP32 Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <HeaderAttribution />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </Button>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <main className="container py-4">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium">API Verbindingsgegevens</h2>
                <div className="grid gap-2 bg-muted p-3 rounded-md">
                  <div>
                    <span className="font-medium">API URL:</span> 
                    <code className="ml-2 bg-background px-1 py-0.5 rounded">{API_BASE_URL}</code>
                  </div>
                  <div>
                    <span className="font-medium">API Key:</span> 
                    <code className="ml-2 bg-background px-1 py-0.5 rounded">tl_sk_e7a2f15b8d6c93741f0</code>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Gebruik deze gegevens voor de ESP32 om verbinding te maken met het stoplicht-systeem.
                    Kopieer de ESP32 code uit het API voorbeeld (esp32ApiService.ts) om snel aan de slag te gaan.
                  </div>
                </div>
              </div>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="devices" className="flex-1">Apparaten</TabsTrigger>
                <TabsTrigger value="thresholds" className="flex-1">Drempelwaarden</TabsTrigger>
                <TabsTrigger value="logs" className="flex-1">Logboek</TabsTrigger>
              </TabsList>
              
              <TabsContent value="devices" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {devices.map(device => (
                    <ESP32ConfigCard 
                      key={device.id} 
                      device={device} 
                      onRefresh={handleRefresh}
                    />
                  ))}
                  
                  <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                    <PlusCircle size={36} className="text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nieuw apparaat toevoegen</p>
                    <Button variant="outline" className="mt-4">
                      Nieuw apparaat
                    </Button>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="thresholds" className="mt-4">
                <PriceThresholdSettings
                  initialHighThreshold={thresholds.high}
                  initialLowThreshold={thresholds.low}
                  initialMediumThreshold={thresholds.medium}
                  onThresholdsChange={handleThresholdsChange}
                />
              </TabsContent>
              
              <TabsContent value="logs" className="mt-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Systeemlogboek</h3>
                  <div className="bg-muted rounded-md p-2 h-64 overflow-y-auto font-mono text-sm">
                    <p className="text-green-500">09:15:22 - ESP32-TL-001 verbonden</p>
                    <p>09:15:25 - Drempelwaarden bijgewerkt</p>
                    <p>09:16:05 - ESP32-TL-001 rapporteert status: groen</p>
                    <p className="text-red-500">10:20:18 - ESP32-TL-002 verbinding verbroken</p>
                    <p>11:05:13 - ESP32-TL-001 rapporteert status: geel</p>
                    <p>12:32:08 - ESP32-TL-001 rapporteert status: rood</p>
                    <p>14:15:47 - ESP32-TL-001 rapporteert status: geel</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
}
