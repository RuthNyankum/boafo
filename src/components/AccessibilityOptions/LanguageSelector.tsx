import React from "react";
import { LanguageOption } from "../../types/accessibility";
import { motion } from "framer-motion";
import { translateText } from "../../utils/translate";

interface LanguageSelectorProps {
  langOptions: LanguageOption[];
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  isFeatureView?: boolean; 
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  langOptions,
  selectedLanguage,
  setSelectedLanguage,
  isFeatureView = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className={`mt-4 flex ${isFeatureView ? "justify-center" : "justify-end"}`} 
    >
      <select
        id="language"
        value={selectedLanguage}
        className={`bg-gray-100 rounded-md border-none focus:ring-1 focus:ring-blue-200 ${
          isFeatureView ? "text-lg p-3" : "text-sm p-2" 
        }`}
        onChange={(e) => {
          setSelectedLanguage(e.target.value);
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id! },
              world: "MAIN",
              func: translateText,
              args: [e.target.value],
            });
          });
        }}
      >
        {langOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.lang}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default LanguageSelector;