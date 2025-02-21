import React from 'react';
import AccessibilityOptions from "./components/AccessibilityOptions/AccessibilityOptions";
import { LanguageProvider } from "./context/language.context";
import { AccessibilityProvider } from "./context/accessibility.context";
import { VoiceProvider } from "./context/voice.context";

function App() {
  return (
    <LanguageProvider>
      <VoiceProvider>
        <AccessibilityProvider>
          <AccessibilityOptions />
        </AccessibilityProvider>
      </VoiceProvider>
    </LanguageProvider>
  );
}

export default App;
