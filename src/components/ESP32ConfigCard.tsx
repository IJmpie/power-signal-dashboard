
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { configureWiFi, resetDevice } from "@/services/esp32ApiService";
import { toast } from "sonner";

export interface ESP32Device {
  id: string;
  name: string;
  connected: boolean;
  lastSeen?: Date;
  batteryLevel?: number;
  wifiStrength?: number;
}

interface ESP32ConfigCardProps {
  device: ESP32Device;
  onRefresh?: () => void;
}

export default function ESP32ConfigCard({ device, onRefresh }: ESP32ConfigCardProps) {
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const handleWifiConfig = async () => {
    if (!wifiSsid) {
      toast.error("SSID is verplicht");
      return;
    }
    
    setIsConfiguring(true);
    
    try {
      const success = await configureWiFi(device.id, {
        ssid: wifiSsid,
        password: wifiPassword,
        securityType: wifiPassword ? "WPA2" : "OPEN"
      });
      
      if (success) {
        toast.success("WiFi-configuratie verzonden");
        setWifiSsid("");
        setWifiPassword("");
        if (onRefresh) onRefresh();
      } else {
        toast.error("WiFi-configuratie mislukt");
      }
    } catch (error) {
      toast.error("Er is een fout opgetreden");
    } finally {
      setIsConfiguring(false);
    }
  };
  
  const handleReset = async () => {
    setIsResetting(true);
    
    try {
      const success = await resetDevice(device.id);
      
      if (success) {
        toast.success("Reset commando verzonden");
        if (onRefresh) onRefresh();
      } else {
        toast.error("Reset commando mislukt");
      }
    } catch (error) {
      toast.error("Er is een fout opgetreden");
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{device.name}</span>
          <div className="flex items-center">
            <div 
              className={`w-3 h-3 rounded-full mr-2 ${device.connected ? 'bg-green-500' : 'bg-red-500'}`} 
            />
            <span className="text-sm font-normal">
              {device.connected ? 'Verbonden' : 'Niet verbonden'}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          {device.lastSeen && `Laatst gezien: ${device.lastSeen.toLocaleString()}`}
          {device.batteryLevel !== undefined && ` • Batterij: ${device.batteryLevel}%`}
          {device.wifiStrength !== undefined && ` • WiFi: ${device.wifiStrength}dBm`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`wifi-ssid-${device.id}`}>WiFi SSID</Label>
            <Input 
              id={`wifi-ssid-${device.id}`}
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              placeholder="Voer WiFi naam in"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`wifi-password-${device.id}`}>WiFi wachtwoord</Label>
            <Input 
              id={`wifi-password-${device.id}`}
              type="password"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder="Voer WiFi wachtwoord in"
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Button 
              onClick={handleWifiConfig}
              disabled={isConfiguring || !wifiSsid}
            >
              {isConfiguring ? "Configureren..." : "WiFi configureren"}
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? "Resetten..." : "Reset apparaat"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
