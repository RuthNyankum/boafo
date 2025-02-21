// context/voice.context.tsx
import React, { createContext, useContext, useState } from 'react';

type VoiceContextType = {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
};

const VoiceContext = createContext<VoiceContextType>({
  selectedVoice: 'NEUTRAL',
  setSelectedVoice: () => {},
});

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedVoice, setSelectedVoice] = useState('NEUTRAL');
  return (
    <VoiceContext.Provider value={{ selectedVoice, setSelectedVoice }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);
