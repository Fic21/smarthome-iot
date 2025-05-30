"use client";

import React, { useState } from "react";

interface TextConfigProps {
  onSave: (data: { widgetName: string; topicName: string }) => void;
  onClose: () => void;
}

const Text: React.FC<TextConfigProps> = ({ onSave, onClose }) => {
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
        Save Widget
      </button>
    </div>
  );
};

export default Text;
