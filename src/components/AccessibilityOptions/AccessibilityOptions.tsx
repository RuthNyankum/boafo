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
      className="p-4 bg-white rounded-lg shadow-lg w-80 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <OCRResult
          image={image}
          isProcessing={isProcessing}
          ocrResult={ocrResult}
        />
      </motion.div>

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
            transition={{ duration: 0.3, ease: "easeInOut" }}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <LanguageSelector
          langOptions={langOptions}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      </motion.div>
    </motion.div>
  );
};

export default AccessibilityOptions;

