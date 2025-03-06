import React from 'react';
import { LanguageProvider } from "./context/language.context";
import { VoiceProvider } from "./context/voice.context";
import MainPage from './components/AccessibilityOptions/MainPage';

function App() {
  return (
    <LanguageProvider>
      <VoiceProvider>
        <MainPage />
      </VoiceProvider>
    </LanguageProvider>
  );
}

export default App;
