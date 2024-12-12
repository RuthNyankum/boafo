import React from "react";
import { useAccessibility } from "../../hooks/useAccessibility";
import OCRResult from "../OCRResult/OCRResults";
import AccessibilityOptionItem from "./AccessibilityOptionItems";
import LanguageSelector from "./LanguageSelector";
import ZoomSlider from "../ZoomSlider";
import { motion, AnimatePresence } from "framer-motion";

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
    zoomLevel,
    setZoomLevel,
    adjustZoom,
  } = useAccessibility();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-lg shadow-lg w-80 mx-auto overflow-hidden"
    >
      <OCRResult
        image={image}
        isProcessing={isProcessing}
        ocrResult={ocrResult}
      />

      <div className="space-y-2">
        {options.map((item, index) => (
          <AccessibilityOptionItem
            key={index}
            item={item}
            index={index}
            openSection={openSection}
            toggleSection={toggleSection}
          />
        ))}
      </div>

      <AnimatePresence>
        {openSection === options.findIndex((opt) => opt.title === "Physical Disability") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2"
          >
            <ZoomSlider
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              adjustZoom={adjustZoom}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <LanguageSelector
        langOptions={langOptions}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </motion.div>
  );
};

export default AccessibilityOptions;

