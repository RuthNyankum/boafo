import { useState } from 'react';
import { FaWheelchair, FaEarDeaf, FaEyeLowVision } from "react-icons/fa6";
import { captureScreenshot } from '../utils/screenshot';
import { readAloud } from '../utils/textToSpeech';
import { AccessibilityOption, LanguageOption } from '../types/accessibility';
import { interfaceResize } from '../utils/interfaceResize';

export const useAccessibility = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [image, setImage] = useState<string>("");
  const [ocrResult, setOcrResult] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("eng");
  const [zoomLevel, setZoomLevel] = useState<number>(120);

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleScreenshotOCR = async () => {
    setIsProcessing(true);
    try {
      await captureScreenshot(
        selectedLanguage, 
        setImage, 
        setOcrResult, 
        (text) => readAloud(text, selectedLanguage === "eng" ? "en-US" : selectedLanguage)
      );
    } finally {
      setIsProcessing(false);
    }
  };
  const adjustZoom = (level: number) => {
    setZoomLevel(level);
    interfaceResize(level);
  };

  const options: AccessibilityOption[] = [
    {
      title: "Visual Impairment",
      description: "Capture image, extract text, and read aloud",
      icon: FaEyeLowVision,
      action: handleScreenshotOCR,
    },
    {
      title: "Hearing Impairment",
      description: "Speech-to-text feature",
      icon: FaEarDeaf,
      action: () => alert("Speech-to-text is currently under development."),
    },
    {
      title: "Physical Disability",
      description: "Resizable interfaces",
      icon: FaWheelchair,
      action: () => adjustZoom(zoomLevel),
    },
  ];

  const langOptions: LanguageOption[] = [
    { lang: "English", value: "eng" },
    { lang: "Twi", value: "twi" },
    { lang: "Ga", value: "ga" },
    { lang: "Fafra", value: "fafra" },
  ];

  return {
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
  };
};