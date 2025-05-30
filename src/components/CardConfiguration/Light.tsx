"use client";

import React, { useState } from "react";

interface LightConfigProps {
  onSave: (data: { widgetName: string; topicName: string }) => void;
  onClose: () => void;
}

const Light: React.FC<LightConfigProps> = ({ onSave, onClose }) => {
  const [widgetName, setWidgetName] = useState("");
  const [topicName, setTopicName] = useState("");

  const handleSave = () => {
    if (!widgetName || !topicName) {
      alert("Please fill in all fields");
      return;
    }
    onSave({ widgetName, topicName });
    onClose();
  };

  return (
    <div>
      <label>Widget Name:</label>
      <input value={widgetName} onChange={(e) => setWidgetName(e.target.value)} />

      <label>Topic Name:</label>
      <input value={topicName} onChange={(e) => setTopicName(e.target.value)} />

      <button onClick={handleSave} style={{ marginTop: 10 }}>
        Save Light Widget
      </button>
    </div>
  );
};

export default Light;
