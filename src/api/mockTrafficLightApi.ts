
import { ThresholdSettings, ESP32StatusUpdate } from "../services/esp32ApiService";

// Mock in-memory data store 
const deviceStatuses: Record<string, ESP32StatusUpdate> = {};
let thresholds: ThresholdSettings = { high: 0.40, medium: 0.25, low: 0.15 };

// API key validation
function validateApiKey(apiKey: string): boolean {
  // In a real implementation, this would verify against stored API keys
  return apiKey === "tl_sk_e7a2f15b8d6c93741f0" || apiKey === "tl_dev_key_for_testing";
}

// Extract API key from Authorization header
function extractApiKey(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

// Rate limiting (simple implementation)
const requestCounts: Record<string, { count: number, lastReset: number }> = {};
const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  
  if (!requestCounts[ip] || now - requestCounts[ip].lastReset > RATE_WINDOW) {
    requestCounts[ip] = { count: 1, lastReset: now };
    return true;
  }
  
  if (requestCounts[ip].count >= RATE_LIMIT) {
    return false;
  }
  
  requestCounts[ip].count++;
  return true;
}

// Mock API routes
export async function handleTrafficLightApiRequest(
  endpoint: string,
  method: string,
  body?: any,
  headers?: Record<string, string>,
  params?: Record<string, string>
) {
  // Rate limiting check
  const clientIp = "127.0.0.1"; // In a real implementation, this would be the actual client IP
  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      body: { error: "Too many requests" }
    };
  }
  
  // Authentication
  const apiKey = extractApiKey(headers?.Authorization || null);
  if (!apiKey || !validateApiKey(apiKey)) {
    return {
      status: 401,
      body: { error: "Invalid or missing API key" }
    };
  }
  
  // Route handling
  if (endpoint === "/status" && method === "POST") {
    return handleStatusUpdate(body);
  } else if (endpoint === "/thresholds" && method === "GET") {
    return handleGetThresholds();
  } else if (endpoint === "/thresholds" && method === "PUT") {
    return handleUpdateThresholds(body);
  } else if (endpoint.startsWith("/command/") && method === "POST") {
    const deviceId = endpoint.replace("/command/", "");
    return handleCommand(deviceId, body);
  } else {
    return {
      status: 404,
      body: { error: "Not found" }
    };
  }
}

function handleStatusUpdate(body: ESP32StatusUpdate) {
  if (!body.deviceId || !body.status || !body.timestamp) {
    return {
      status: 400,
      body: { error: "Missing required fields" }
    };
  }
  
  deviceStatuses[body.deviceId] = body;
  
  return {
    status: 200,
    body: { success: true }
  };
}

function handleGetThresholds() {
  return {
    status: 200,
    body: thresholds
  };
}

function handleUpdateThresholds(body: ThresholdSettings) {
  if (!body.high || !body.medium || !body.low) {
    return {
      status: 400,
      body: { error: "Missing threshold values" }
    };
  }
  
  thresholds = body;
  
  return {
    status: 200,
    body: { success: true }
  };
}

function handleCommand(deviceId: string, body: any) {
  if (!deviceId || !body.command) {
    return {
      status: 400,
      body: { error: "Invalid command" }
    };
  }
  
  // In a real implementation, this would communicate with the device or queue commands
  
  return {
    status: 200,
    body: {
      success: true,
      message: `Command ${body.command} sent to device ${deviceId}`
    }
  };
}

// For debugging/monitoring
export function getDeviceStatus(deviceId: string): ESP32StatusUpdate | null {
  return deviceStatuses[deviceId] || null;
}

export function getAllDeviceStatuses(): Record<string, ESP32StatusUpdate> {
  return { ...deviceStatuses };
}

export function getCurrentThresholds(): ThresholdSettings {
  return { ...thresholds };
}

// Register your mock API handler when using a service worker or mock API framework
// This code would run in a service worker or API mock handler
// Example: 
// registerApiRoute(/\/api\/trafficlight\/.*/, handleTrafficLightApiRequest);
