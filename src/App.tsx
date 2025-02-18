import AccessibilityOptions from "./components/AccessibilityOptions/AccessibilityOptions";
import { LanguageProvider } from "./context/language.context";

function App() {
  return (
    <LanguageProvider>
      <AccessibilityOptions />
    </LanguageProvider>
  );
}

export default App;
