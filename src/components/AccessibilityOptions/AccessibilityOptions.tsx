import React from "react";
import { useAccessibility } from "../../hooks/useAccessibility";
import AccessibilityOptionItem from "./AccessibilityOptionItems";
import LanguageSelector from "./LanguageSelector";
import ZoomSlider from "../ZoomSlider";
import { motion, AnimatePresence } from "framer-motion";
import { FaStop } from "react-icons/fa";

const AccessibilityOptions: React.FC = () => {
  const {
    openSection,
    selectedLanguage,
    options,
    langOptions,
    toggleSection,
    setSelectedLanguage,
    zoomLevel,
    setZoomLevel,
    adjustZoom,
    isProcessing,
  } = useAccessibility();

  const stopReading = () => {
    chrome.runtime.sendMessage({ action: "stopReading" }, (response) => {
      if (response.status === "success") {
        console.log("Reading stopped.");
      } else {
        console.error(response.message);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-lg shadow-lg w-80 overflow-hidden"
    >
      <h2 className="font-bold mb-2 text-gray-800">Accessibility Options</h2>
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
        {openSection === options.findIndex((opt) => opt.title === "Visual Impairment") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-2"
          >
            <button
              onClick={stopReading}
              disabled={isProcessing}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaStop />
              <span>Stop Reading</span>
            </button>
          </motion.div>
        )}

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
