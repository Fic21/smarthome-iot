import { useEffect, useState, useRef } from "react";
import mqtt, { MqttClient, IClientPublishOptions } from "mqtt";
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
      setLogs((l) => [...l, "MQTT Broker URL or Token is missing"]);
      setIsConnected(false);
      return;
    }

    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
    }

    const connectUrl = deviceConfig.mqttBrokerUrl;
    const client = mqtt.connect(connectUrl, {
      clientId: deviceConfig.deviceId,
      username: deviceConfig.mqttToken,
      reconnectPeriod: 10000,
    });

    clientRef.current = client;
    const topic = deviceConfig.topic;

    // Ambil QoS dari inputtambahan[0], default 0 jika tidak valid
    const parsedQoS = parseInt(deviceConfig.inputtambahan?.[0] ?? "0");
    const qos: 0 | 1 | 2 = [0, 1, 2].includes(parsedQoS) ? (parsedQoS as 0 | 1 | 2) : 0;

    client.on("connect", () => {
      setIsConnected(true);
      setLogs((l) => [...l, `Connected to ${connectUrl} as ${deviceConfig.id}`]);

      if (deviceConfig.type === "subscriber") {
        client.subscribe(topic, { qos }, (err) => {
          if (err) {
            setLogs((l) => [...l, `Failed to subscribe: ${err.message}`]);
          } else {
            setLogs((l) => [...l, `Subscribed to ${topic} with QoS ${qos}`]);
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
      setLogs((l) => [...l, `[${topic}] ${message.toString()}`]);
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

    const parsedQoS = parseInt(deviceConfig.inputtambahan?.[0] ?? "0");
    const qos: 0 | 1 | 2 = [0, 1, 2].includes(parsedQoS) ? (parsedQoS as 0 | 1 | 2) : 0;

    const options: IClientPublishOptions = { qos };

    clientRef.current.publish(deviceConfig.topic, message, options, (err) => {
      if (err) {
        setLogs((l) => [...l, `Publish error: ${err.message}`]);
      } else {
        setLogs((l) => [...l, `Published message: "${message}" with QoS ${qos}`]);
      }
    });
  };

  return {
    isConnected,
    logs,
    publish,
  };
}
