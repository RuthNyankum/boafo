import { useState, useCallback } from "react";
import { FaWheelchair, FaEarDeaf, FaEyeLowVision } from "react-icons/fa6";
import { AccessibilityOption, LanguageOption } from "../types/accessibility";
import { interfaceResize } from "../utils/interfaceResize";
import { readAloud } from "../utils/textToSpeech";
import { speechToText } from "../utils/speechToText";

export const useAccessibility = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-US");
  const [zoomLevel, setZoomLevel] = useState<number>(120);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const adjustZoom = useCallback((level: number) => {
    setZoomLevel(level);
    interfaceResize(level);
  }, []);

  const handleTextToSpeech = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const response = await readAloud("auto", selectedLanguage);

      if (response.status === "error") {
        console.error("Text-to-speech error:", response.message);
      }
    } catch (error) {
      console.error("Text-to-speech error:", error);
    } finally {
      setIsProcessing(false);
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
    { lang: "Twi", value: "twi" },
    { lang: "Ga", value: "ga" },
    { lang: "Frafra", value: "fafra" },
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
  };
};
