import { useState, useCallback } from "react";
import { FaWheelchair, FaEarDeaf, FaEyeLowVision } from "react-icons/fa6";
import {
  pauseReading,
  readAloud,
  resumeReading,
  stopReading,
} from "../utils/textToSpeech";
import { speechToText } from "../utils/speechToText";
import { AccessibilityOption, LanguageOption } from "../types/accessibility";
import { interfaceResize } from "../utils/interfaceResize";

export const useAccessibility = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-US");
  const [zoomLevel, setZoomLevel] = useState<number>(120);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(true);

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const adjustZoom = useCallback((level: number) => {
    setZoomLevel(level);
    interfaceResize(level);
  }, []);

  const handleTextToSpeech = async () => {
    if (isProcessing || !isStopped) return; // Prevent restarting if already running

    try {
      setIsProcessing(true);
      setIsStopped(false); // TTS has started
      setIsPaused(false); // Ensure not paused
      const response = await readAloud({
        mode: "auto",
        language: selectedLanguage,
      });

      if (response.status === "error") {
        console.error("Text-to-speech error:", response.message);
      }
    } catch (error) {
      console.error("Text-to-speech error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleStopReading = async () => {
    try {
      const response = await stopReading();
      if (response.status === "success") {
        setIsStopped(true); // Mark as stopped
        setIsPaused(false); // Reset pause state
      }
    } catch (error) {
      console.error("Error stopping reading:", error);
    }
  };

  const handlePauseResume = async () => {
    if (isStopped) return; // Don't allow pause/resume if TTS is stopped

    try {
      if (isPaused) {
        const response = await resumeReading();
        if (response.status === "success") {
          setIsPaused(false);
        }
      } else {
        const response = await pauseReading();
        if (response.status === "success") {
          setIsPaused(true);
        }
      }
    } catch (error) {
      console.error("Error toggling pause/resume:", error);
    }
  };

  const handleSpeechToText = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const response = await speechToText();
      if (response.status === "error") {
        console.error("Speech-to-text error:", response.message);
      }
    } catch (error) {
      console.error("Speech-to-text error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const options: AccessibilityOption[] = [
    {
      title: "Visual Impairment",
      description: "Extract and read text from the page aloud",
      icon: FaEyeLowVision,
      action: handleTextToSpeech,
    },
    {
      title: "Hearing Impairment",
      description: "Convert audio/video speech to text",
      icon: FaEarDeaf,
      action: handleSpeechToText,
    },
    {
      title: "Physical Disability",
      description: "Resizable interfaces",
      icon: FaWheelchair,
      action: () => adjustZoom(zoomLevel),
    },
  ];

  const langOptions: LanguageOption[] = [
    { lang: "English", value: "en-US" },
    { lang: "Twi", value: "ak" },
    { lang: "Ga", value: "gaa" },
    { lang: "Frafra", value: "dag" },
    { lang: "Ewe", value: "ee" },
  ];

  return {
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
  };
};
