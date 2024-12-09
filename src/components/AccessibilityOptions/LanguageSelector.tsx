import React from 'react';
import { LanguageOption } from '../../types/accessibility';

interface LanguageSelectorProps {
  langOptions: LanguageOption[];
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  langOptions,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  return (
    <div className="mt-6 flex justify-end">
      <div className="bg-gray-100 rounded-lg shadow-md p-3 w-fit">
        <select
          id="language"
          value={selectedLanguage}
          className="bg-gray-100 text-lg focus:outline-none"
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {langOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.lang}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;