// components/VoiceSelector.tsx

import React from "react";

interface VoiceSelectorProps {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, setSelectedVoice }) => {
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
