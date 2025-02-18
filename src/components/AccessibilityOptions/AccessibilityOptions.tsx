import React from "react";
import { useAccessibility } from "../../hooks/useAccessibility";
import { useLanguage } from "../../context/language.context";
import LanguageSelector from "./LanguageSelector";
import { motion } from "framer-motion";
import {
  FaStop,
  FaPause,
  FaPlay,
  FaMicrophone,
  FaMicrophoneSlash,
  FaSearchPlus,
  FaSearchMinus,
} from "react-icons/fa";
import { useAccessibilityContext } from "../../context/accessibility.context";
import AccessibilityOptionItem from "./AccessibilityOptionItems";

const AccessibilityOptions: React.FC = () => {
  // Get feature actions and states from our custom hooks.
  const {
    options,
    isProcessing,
    isPaused: ttsIsPaused,
    isStopped,
    handleTextToSpeech,
    handleStopReading,
    handlePauseResume: ttsHandlePauseResume,
    isTranscribing,
    handleSpeechToText,
    handleStopTranscription,
    handlePauseResume: sttHandlePauseResume, // for speech-to-text pause/resume
    zoomLevel,
    adjustZoom,
  } = useAccessibility();

  // Language management.
  const { selectedLanguage, setSelectedLanguage, langOptions } = useLanguage();

  // Use AccessibilityContext for view mode and selected feature.
  const { viewMode, selectedFeature, toggleFeature, backToFeatures } = useAccessibilityContext();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`p-4 bg-white rounded-lg shadow-lg w-80 overflow-hidden ${viewMode === "feature" ? "w-96" : ""}`}
    >
      {viewMode === "all" ? (
        <>
          <h2 className="font-bold mb-2 text-gray-800">Accessibility Options</h2>
          <div className="space-y-2">
            {options.map((item, index) => (
              <AccessibilityOptionItem
                key={index}
                item={item}
                index={index}
                openSection={selectedFeature}
                toggleSection={toggleFeature}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={backToFeatures}
            className="text-sm font-medium text-blue-500 hover:text-blue-600 mb-4"
          >
            ← Back to Features
          </button>

          {selectedFeature !== null && (
            <div className="space-y-4">
              {/* Visual Impairment Section */}
              {options[selectedFeature].title === "Visual Impairment" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex space-x-4">
                    <button
                      onClick={isStopped ? handleTextToSpeech : handleStopReading}
                      disabled={isProcessing}
                      className={`flex-1 py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center space-x-3 text-lg ${
                        isStopped
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {isStopped ? <FaPlay size={24} /> : <FaStop size={24} />}
                      <span>{isStopped ? "Start" : "Stop"}</span>
                    </button>

                    {!isStopped && (
                      <button
                        onClick={ttsHandlePauseResume}
                        disabled={isProcessing}
                        className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-3 text-lg disabled:opacity-50"
                      >
                        {ttsIsPaused ? <FaPlay size={24} /> : <FaPause size={24} />}
                        <span>{ttsIsPaused ? "Resume" : "Pause"}</span>
                      </button>
                    )}
                  </div>

                  <div className="text-base text-gray-600 text-center mt-2">
                    {isProcessing
                      ? "Processing..."
                      : isStopped
                      ? "Text-to-speech stopped"
                      : ttsIsPaused
                      ? "Paused"
                      : "Running"}
                  </div>
                </motion.div>
              )}

              {/* Hearing Impairment Section */}
              {options[selectedFeature].title === "Hearing Impairment" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex space-x-4">
                    <button
                      onClick={isTranscribing ? handleStopTranscription : handleSpeechToText}
                      disabled={isProcessing}
                      className={`flex-1 py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center space-x-3 text-lg ${
                        isTranscribing
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {isTranscribing ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
                      <span>{isTranscribing ? "Stop Transcribing" : "Start Transcribing"}</span>
                    </button>
                  </div>

                  {isTranscribing && (
                    <div className="flex space-x-4">
                      <button
                        onClick={sttHandlePauseResume}
                        disabled={isProcessing}
                        className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-3 text-lg disabled:opacity-50"
                      >
                        <span>Toggle Pause/Resume</span>
                      </button>

                      <button
                        onClick={handleStopTranscription}
                        disabled={isProcessing}
                        className="flex-1 bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center space-x-3 text-lg disabled:opacity-50"
                      >
                        <FaStop size={24} />
                        <span>Stop</span>
                      </button>
                    </div>
                  )}

                  <div className="text-base text-gray-600 text-center mt-2">
                    {isProcessing
                      ? "Processing..."
                      : isTranscribing
                      ? "Transcribing audio..."
                      : "Ready to transcribe"}
                  </div>
                </motion.div>
              )}

              {/* Physical Disability Section */}
              {options[selectedFeature].title === "Physical Disability" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => adjustZoom(zoomLevel - 10)}
                      disabled={zoomLevel <= 50}
                      className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      <FaSearchMinus size={24} />
                    </button>
                    <span className="text-xl text-gray-700">{zoomLevel}%</span>
                    <button
                      onClick={() => adjustZoom(zoomLevel + 10)}
                      disabled={zoomLevel >= 200}
                      className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      <FaSearchPlus size={24} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </>
      )}

      {/* Language Selector */}
      <LanguageSelector
        langOptions={langOptions}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isFeatureView={viewMode === "feature"}
      />
    </motion.div>
  );
};

export default AccessibilityOptions;
