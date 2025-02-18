import { createContext, useContext, useState } from 'react';
import { LanguageOption } from '../types/accessibility';

type LanguageContextType = {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  langOptions: LanguageOption[];
};

const LanguageContext = createContext<LanguageContextType>({
  selectedLanguage: 'en-US',
  setSelectedLanguage: () => {},
  langOptions: []
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const langOptions: LanguageOption[] = [
    { lang: "English", value: "en-US" },
    { lang: "Twi", value: "ak" },
    { lang: "Ga", value: "gaa" },
    { lang: "Frafra", value: "dag" },
    { lang: "Ewe", value: "ee" },
    { lang: "French", value: "fr" },
    { lang: "Spanish", value: "es" },
  ];

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, langOptions }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);