
import { useState, useEffect } from "react";
import { Bell, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [volume, setVolume] = useState(50);
  const [thresholdPrice, setThresholdPrice] = useState(0.20);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleThresholdChange = (value: number[]) => {
    setThresholdPrice(value[0]);
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast.success("Notificaties zijn nu ingeschakeld!");
      } else {
        toast.error("Je moet notificaties toestaan om meldingen te ontvangen");
      }
    } else {
      toast.error("Je browser ondersteunt geen notificaties");
    }
  };

  const sendTestNotification = () => {
    if (notificationPermission === "granted") {
      // Play notification sound
      const audio = new Audio();
      audio.src = `data:audio/mp3;base64,SUQzAwAAAAABF1RTRVIKAAAAI1RTU0UKAAAATS9yb2NrL2luc3RydW1lbnRhbC9wb3AvYS90cmFuc2l0aW9uZWZmZWN0cy9ob3dsZXJzL1RyYW5zbWlzc2lvbi53YXYKSUQzAwAAAAABGFRTRlQKAAAAMjAwMi0xMi0xNwpJRDMDAAAAABJUTEVOCgAAADAwMDA6MDA6MDAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAADwAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tUxAAAAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV`;
      audio.volume = volume / 100;
      audio.play();
      
      // Show browser notification
      const notification = new Notification("Stroomprijs Alert", {
        body: `De stroomprijs is onder ${formatCurrency(thresholdPrice)}/kWh gedaald!`,
        icon: "/favicon.ico"
      });
      
      // Close notification after 5 seconds
      setTimeout(() => notification.close(), 5000);
      
      toast.success("Test notificatie verstuurd!");
    } else {
      requestNotificationPermission();
    }
  };

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notificatie Instellingen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="flex items-center space-x-2">
            <span>Notificaties inschakelen</span>
          </Label>
          <Switch 
            id="notifications" 
            checked={notificationsEnabled} 
            onCheckedChange={(checked) => {
              if (checked && notificationPermission !== "granted") {
                requestNotificationPermission();
              } else {
                setNotificationsEnabled(checked);
              }
            }} 
          />
        </div>

        <div className="space-y-2">
          <Label>Prijsdrempel voor notificaties</Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">€0.15</span>
            <span className="text-sm font-medium">{formatCurrency(thresholdPrice)}</span>
            <span className="text-sm text-muted-foreground">€0.40</span>
          </div>
          <Slider 
            defaultValue={[thresholdPrice]} 
            max={0.40} 
            min={0.15} 
            step={0.01} 
            onValueChange={handleThresholdChange}
            disabled={!notificationsEnabled}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Je ontvangt een notificatie wanneer de stroomprijs onder {formatCurrency(thresholdPrice)}/kWh komt
          </p>
        </div>

        <div className="space-y-2">
          <Label>Volume</Label>
          <div className="flex items-center justify-between">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider 
              defaultValue={[volume]} 
              max={100} 
              min={0} 
              step={1} 
              onValueChange={handleVolumeChange}
              disabled={!notificationsEnabled}
              className="mx-2"
            />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Button 
          className="w-full" 
          disabled={!notificationsEnabled && notificationPermission !== "default"}
          onClick={sendTestNotification}
        >
          {notificationPermission === "granted" ? "Test Notificatie" : "Notificaties toestaan"}
        </Button>
      </CardContent>
    </Card>
  );
}
