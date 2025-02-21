// components/VoiceSelector.tsx
import React from "react";
import { useVoice } from "../context/voice.context"; // Import the hook

const VoiceSelector: React.FC = () => {
  const { selectedVoice, setSelectedVoice } = useVoice();
  const voiceOptions = [
    { label: "Neutral", value: "NEUTRAL" },
    { label: "Female", value: "FEMALE" },
    { label: "Male", value: "MALE" },
  ];

  return (
    <div>
      <label htmlFor="voice-selector">Voice: </label>
      <select
        id="voice-selector"
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
      >
        {voiceOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VoiceSelector;
