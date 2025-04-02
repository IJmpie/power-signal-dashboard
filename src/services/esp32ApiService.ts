
import { toast } from "sonner";

// API key for authentication (in a real system, this would be stored securely)
const API_KEY = "tl_sk_e7a2f15b8d6c93741f0"; // Simple example key

// URL for the API
export const API_BASE_URL = window.location.hostname.includes('localhost') 
  ? 'http://localhost:5173/api/trafficlight'
  : `${window.location.origin}/api/trafficlight`;

export type TrafficLightStatus = 'red' | 'yellow' | 'green';

export interface ESP32StatusUpdate {
  deviceId: string;
  status: TrafficLightStatus;
  price?: number;
  timestamp: string;
  batteryLevel?: number;
  wifiStrength?: number;
}

export interface ESP32Command {
  command: 'reset' | 'update_threshold' | 'change_status' | 'wifi_config';
  params?: Record<string, any>;
}

export interface ThresholdSettings {
  high: number;
  medium: number;
  low: number;
}

export interface WiFiConfig {
  ssid: string;
  password: string;
  securityType: 'WPA' | 'WPA2' | 'WEP' | 'OPEN';
}

/**
 * Send status update from ESP32 to server
 */
export async function sendStatusUpdate(
  statusUpdate: ESP32StatusUpdate, 
  apiKey = API_KEY
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(statusUpdate),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to send ESP32 status update:", error);
    return false;
  }
}

/**
 * Get current thresholds from server
 */
export async function getThresholds(apiKey = API_KEY): Promise<ThresholdSettings | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/thresholds`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch thresholds:", error);
    return null;
  }
}

/**
 * Update threshold settings
 */
export async function updateThresholds(
  thresholds: ThresholdSettings, 
  apiKey = API_KEY
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/thresholds`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(thresholds),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to update thresholds:", error);
    toast.error("Kon de drempelwaarden niet bijwerken");
    return false;
  }
}

/**
 * Send command to ESP32
 */
export async function sendCommand(
  deviceId: string, 
  command: ESP32Command, 
  apiKey = API_KEY
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/command/${deviceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to send command to ESP32:", error);
    toast.error("Kon commando niet verzenden");
    return false;
  }
}

/**
 * Configure WiFi settings for ESP32
 */
export async function configureWiFi(
  deviceId: string, 
  config: WiFiConfig, 
  apiKey = API_KEY
): Promise<boolean> {
  const command: ESP32Command = {
    command: 'wifi_config',
    params: config
  };
  
  return sendCommand(deviceId, command, apiKey);
}

/**
 * Reset ESP32 device
 */
export async function resetDevice(deviceId: string, apiKey = API_KEY): Promise<boolean> {
  const command: ESP32Command = {
    command: 'reset'
  };
  
  return sendCommand(deviceId, command, apiKey);
}

/**
 * Sample ESP32 API code for Arduino IDE
 * 
 * This is an example of how an ESP32 device would connect to this API:
 * 
 * ```cpp
 * #include <WiFi.h>
 * #include <HTTPClient.h>
 * #include <ArduinoJson.h>
 * 
 * const char* ssid = "YourWiFiSSID";
 * const char* password = "YourWiFiPassword";
 * const char* apiKey = "tl_sk_e7a2f15b8d6c93741f0";
 * const char* apiUrl = "https://your-app-url.com/api/trafficlight";
 * const char* deviceId = "ESP32-TL-001"; 
 * 
 * void setup() {
 *   Serial.begin(115200);
 *   WiFi.begin(ssid, password);
 *   
 *   while (WiFi.status() != WL_CONNECTED) {
 *     delay(1000);
 *     Serial.println("Connecting to WiFi...");
 *   }
 *   Serial.println("Connected to WiFi");
 * }
 * 
 * void sendStatusUpdate(String status, float price) {
 *   if(WiFi.status() == WL_CONNECTED) {
 *     HTTPClient http;
 *     http.begin(String(apiUrl) + "/status");
 *     http.addHeader("Content-Type", "application/json");
 *     http.addHeader("Authorization", "Bearer " + String(apiKey));
 *     
 *     StaticJsonDocument<200> doc;
 *     doc["deviceId"] = deviceId;
 *     doc["status"] = status;
 *     doc["price"] = price;
 *     doc["timestamp"] = String(millis());
 *     doc["batteryLevel"] = 100;
 *     doc["wifiStrength"] = WiFi.RSSI();
 *     
 *     String requestBody;
 *     serializeJson(doc, requestBody);
 *     
 *     int httpResponseCode = http.POST(requestBody);
 *     if(httpResponseCode > 0) {
 *       String response = http.getString();
 *       Serial.println("Response: " + response);
 *     } else {
 *       Serial.println("Error on sending POST: " + http.errorToString(httpResponseCode));
 *     }
 *     http.end();
 *   }
 * }
 * 
 * void getThresholds() {
 *   if(WiFi.status() == WL_CONNECTED) {
 *     HTTPClient http;
 *     http.begin(String(apiUrl) + "/thresholds");
 *     http.addHeader("Authorization", "Bearer " + String(apiKey));
 *     
 *     int httpResponseCode = http.GET();
 *     if(httpResponseCode > 0) {
 *       String payload = http.getString();
 *       Serial.println("Thresholds: " + payload);
 *       
 *       // Parse JSON
 *       StaticJsonDocument<200> doc;
 *       deserializeJson(doc, payload);
 *       float high = doc["high"];
 *       float medium = doc["medium"];
 *       float low = doc["low"];
 *       
 *       // Use the thresholds
 *       Serial.println("High: " + String(high));
 *       Serial.println("Medium: " + String(medium));
 *       Serial.println("Low: " + String(low));
 *     }
 *     http.end();
 *   }
 * }
 * 
 * void loop() {
 *   // Example: Send status update every 30 seconds
 *   sendStatusUpdate("green", 0.25);
 *   delay(5000);
 *   
 *   // Example: Get thresholds every minute
 *   getThresholds();
 *   delay(30000);
 * }
 * ```
 */
