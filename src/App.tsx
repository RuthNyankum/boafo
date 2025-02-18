import React from 'react';
import AccessibilityOptions from "./components/AccessibilityOptions/AccessibilityOptions";
import { LanguageProvider } from "./context/language.context";
import { AccessibilityProvider } from "./context/accessibility.context";

function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AccessibilityOptions />
      </AccessibilityProvider>
    </LanguageProvider>
  );
}

export default App;
