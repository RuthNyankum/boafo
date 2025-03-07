// src/components/LanguageSelector/LanguageSelector.tsx
import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { useLanguage } from "../../context/language.context";
import { getLanguageCodes } from "../../utils/languageMapping";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isFeatureView?: boolean;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const { langOptions } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    const codes = getLanguageCodes(newValue);

    // Update language for speech recognition and TTS in background scripts
    chrome.runtime.sendMessage({ action: "updateLanguage", language: codes.speech });
  };

  return (
    <div className="relative mt-2">
      <select
        id="language"
        value={value}
        onChange={handleChange}
        className="
          w-full
          h-10
          px-3
          pr-8
          text-sm
          text-gray-800
          bg-gray-100
          border
          border-gray-300
          rounded-md
          appearance-none
          focus:outline-none
          focus:ring-1
          focus:ring-green-300
        "
      >
        {langOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.lang}
          </option>
        ))}
      </select>
      <ChevronsUpDown
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
    </div>
  );
}
