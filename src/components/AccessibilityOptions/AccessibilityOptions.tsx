import React from "react";
import { useAccessibility } from "../../hooks/useAccessibility";
import AccessibilityOptionItem from "./AccessibilityOptionItems";
import LanguageSelector from "./LanguageSelector";
import ZoomSlider from "../ZoomSlider";
import { motion, AnimatePresence } from "framer-motion";
import { FaStop, FaPause, FaPlay } from "react-icons/fa";

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
    isPaused,
    isStopped,
    handleStopReading,
    handlePauseResume,
    handleTextToSpeech,
  } = useAccessibility();

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

      {/* Controls for Visual Impairment */}
      <AnimatePresence>
        {openSection === options.findIndex((opt) => opt.title === "Visual Impairment") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-2 space-y-2"
          >
            <div className="flex space-x-2">
              <button
                onClick={isStopped ? handleTextToSpeech : handleStopReading}
                disabled={isProcessing}
                className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  isStopped ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {isStopped ? <FaPlay /> : <FaStop />}
                <span>{isStopped ? "Start" : "Stop"}</span>
              </button>

              {!isStopped && (
                <button
                  onClick={handlePauseResume}
                  disabled={isProcessing}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isPaused ? <FaPlay /> : <FaPause />}
                  <span>{isPaused ? "Resume" : "Pause"}</span>
                </button>
              )}
            </div>

            <div className="text-xs text-gray-600 text-center mt-2">
              {isProcessing
                ? "Processing..."
                : isStopped
                ? "Text-to-speech stopped"
                : isPaused
                ? "Paused"
                : "Running"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Controls for Physical Disability */}
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

      {/* Language Selector */}
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
