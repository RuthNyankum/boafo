import { useState } from 'react';
import { FaWheelchair, FaEarDeaf, FaEyeLowVision } from 'react-icons/fa6';
import { useTextToSpeech } from './useTextToSpeech';
import { useSpeechToText } from './useSpeechToText';
import { useZoom } from './useZoom';
import { AccessibilityOption } from '../types/accessibility';

export const useAccessibility = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const tts = useTextToSpeech();
  const stt = useSpeechToText();
  const zoom = useZoom();

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const options: AccessibilityOption[] = [
    {
      title: "Visual Impairment",
      description: "Extract and read text from the page aloud",
      icon: FaEyeLowVision,
      action: tts.handleTextToSpeech,
    },
    {
      title: "Hearing Impairment",
      description: "Convert audio/video speech to text",
      icon: FaEarDeaf,
      action: stt.handleSpeechToText,
    },
    {
      title: "Physical Disability",
      description: "Resizable interfaces",
      icon: FaWheelchair,
      action: () => zoom.adjustZoom(zoom.zoomLevel),
    },
  ];

  return {
    openSection,
    options,
    toggleSection,
    ...tts,
    ...stt,
    ...zoom,
  };
};