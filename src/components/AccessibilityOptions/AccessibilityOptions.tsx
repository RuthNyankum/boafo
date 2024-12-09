import React from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import OCRResult from '../OCRResult/OCRResults';
import AccessibilityOptionItem from './AccessibilityOptionItems';
import LanguageSelector from './LanguageSelector';


const AccessibilityOptions: React.FC = () => {
  const {
    openSection,
    image,
    ocrResult,
    isProcessing,
    selectedLanguage,
    options,
    langOptions,
    toggleSection,
    setSelectedLanguage,
  } = useAccessibility();

  return (
    <div className="p-14 bg-white rounded-lg shadow-lg w-full md:w-2/3 mx-auto">
      <OCRResult 
        image={image} 
        isProcessing={isProcessing} 
        ocrResult={ocrResult} 
      />

      {options.map((item, index) => (
        <AccessibilityOptionItem
          key={index}
          item={item}
          index={index}
          openSection={openSection}
          toggleSection={toggleSection}
        />
      ))}

      <LanguageSelector 
        langOptions={langOptions} 
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </div>
  );
};

export default AccessibilityOptions;