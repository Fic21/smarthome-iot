import { useEffect, useState, useRef } from "react";
import mqtt, { MqttClient } from "mqtt";
import type { MqttDeviceConfig } from "@/libmqttConfig";

interface UseMqttClientReturn {
  isConnected: boolean;
  logs: string[];
  publish: (message: string) => void;
}

export function useMqttClient(deviceConfig?: MqttDeviceConfig): UseMqttClientReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    if (!deviceConfig) {
      setLogs((l) => [...l, "Device config is undefined"]);
      setIsConnected(false);
      return;
    }

    if (!deviceConfig.mqttBrokerUrl || !deviceConfig.mqttToken) {
      setLogs((l) => [...l, "MQTT Broker URL or Token is missing in device config"]);
      setIsConnected(false);
      return;
    }

    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
    }

    const connectUrl = deviceConfig.mqttBrokerUrl;

    const client = mqtt.connect(connectUrl, {
      clientId: deviceConfig.id,
      username: deviceConfig.mqttToken,
      reconnectPeriod: 10000,
      // kamu bisa tambahkan port/protocol jika broker kamu butuh
      // port: deviceConfig.mqttBrokerPort,
      // protocol: 'ws',
    });

    clientRef.current = client;
    const topic = deviceConfig.topic;

    client.on("connect", () => {
      setIsConnected(true);
      setLogs((l) => [...l, `Connected to ${connectUrl} as ${deviceConfig.id}`]);
      if (deviceConfig.type === "subscriber") {
        client.subscribe(topic, (err) => {
          if (err) {
            setLogs((l) => [...l, `Failed to subscribe to ${topic}: ${err.message}`]);
          } else {
            setLogs((l) => [...l, `Subscribed to ${topic}`]);
          }
        });
      }
    });

    client.on("reconnect", () => {
      setIsConnected(false);
      setLogs((l) => [...l, "Reconnecting..."]);
    });

    client.on("close", () => {
      setIsConnected(false);
      setLogs((l) => [...l, "Disconnected"]);
    });

    client.on("error", (error) => {
      setLogs((l) => [...l, `Error: ${error.message}`]);
    });

    client.on("message", (topic, message) => {
      const msgStr = message.toString();
      setLogs((l) => [...l, `[${topic}] ${msgStr}`]);
    });

    return () => {
      client.end(true);
      setIsConnected(false);
      setLogs((l) => [...l, "Client disconnected (cleanup)"]);
    };
  }, [deviceConfig]);

  const publish = (message: string) => {
    if (!clientRef.current) {
      setLogs((l) => [...l, "Client not connected"]);
      return;
    }
    if (deviceConfig?.type !== "publisher") {
      setLogs((l) => [...l, "Publish is only allowed for publisher devices"]);
      return;
    }

    clientRef.current.publish(deviceConfig.topic, message, (err) => {
      if (err) {
        setLogs((l) => [...l, `Publish error: ${err.message}`]);
      } else {
        setLogs((l) => [...l, `Published message: ${message}`]);
      }
    });
  };

  return {
    isConnected,
    logs,
    publish,
  };
}
