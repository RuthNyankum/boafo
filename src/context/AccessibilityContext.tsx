"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Define a single interface that combines everything you need:
type ViewMode = "all" | "feature";

interface AccessibilityState {
  // Feature view state
  viewMode: ViewMode;
  selectedFeature: number | null;

  // Interface settings
  interfaceLanguage: string;
  darkMode: boolean;
  readerSpeed: number;
  readerVoice: string;

  // Eye Strain settings
  fontSize: number;
  interfaceScale: number;
  brightness: number;

  // Hearing Impairment settings
  sourceLanguage: string;
  targetLanguage: string;
  autoTranslate: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  // Methods for view mode logic
  toggleFeature: (index: number) => void;
  backToFeatures: () => void;

  // Methods for interface settings
  setInterfaceLanguage: (lang: string) => void;
  toggleDarkMode: () => void;
  setReaderSpeed: (speed: number) => void;
  setReaderVoice: (voice: string) => void;

  // Setter functions for Eye Strain settings
  setFontSize: (size: number) => void;
  setInterfaceScale: (scale: number) => void;
  setBrightness: (brightness: number) => void;

  // Setter functions for Hearing Impairment settings
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  toggleAutoTranslate: () => void;

  resetAllSettings: () => void;
}

// Create the React Context (starting with undefined)
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Default values (include all new properties)
const defaultState: AccessibilityState = {
  viewMode: "all",
  selectedFeature: null,
  interfaceLanguage: "en",
  darkMode: false,
  readerSpeed: 1,
  readerVoice: "neutral",
  fontSize: 16,         // default font size in pixels
  interfaceScale: 1,    // default scale (1 = 100%)
  brightness: 100,      // default brightness in percent
  sourceLanguage: "en", // default source language for transcription
  targetLanguage: "",   // default target language (empty means none)
  autoTranslate: false, // default auto-translate off
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(defaultState);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem("boafo-accessibility-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((prev) => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error("Failed to parse saved accessibility settings:", err);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("boafo-accessibility-settings", JSON.stringify(state));
  }, [state]);

  // Apply dark mode to the document element
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.darkMode]);

  // Action creators
  const toggleFeature = (index: number) => {
    setState((prev) => ({
      ...prev,
      selectedFeature: index,
      viewMode: "feature",
    }));
  };

  const backToFeatures = () => {
    setState((prev) => ({
      ...prev,
      selectedFeature: null,
      viewMode: "all",
    }));
  };

  const setInterfaceLanguage = (lang: string) => {
    setState((prev) => ({ ...prev, interfaceLanguage: lang }));
  };

  const toggleDarkMode = () => {
    setState((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setReaderSpeed = (speed: number) => {
    setState((prev) => ({ ...prev, readerSpeed: speed }));
  };

  const setReaderVoice = (voice: string) => {
    setState((prev) => ({ ...prev, readerVoice: voice }));
  };

  // Setter functions for Eye Strain settings
  const setFontSize = (size: number) => {
    setState((prev) => ({ ...prev, fontSize: size }));
  };

  const setInterfaceScale = (scale: number) => {
    setState((prev) => ({ ...prev, interfaceScale: scale }));
  };

  const setBrightness = (brightness: number) => {
    setState((prev) => ({ ...prev, brightness }));
  };

  // Setter functions for Hearing Impairment settings
  const setSourceLanguage = (lang: string) => {
    setState((prev) => ({ ...prev, sourceLanguage: lang }));
  };

  const setTargetLanguage = (lang: string) => {
    setState((prev) => ({ ...prev, targetLanguage: lang }));
  };

  const toggleAutoTranslate = () => {
    setState((prev) => ({ ...prev, autoTranslate: !prev.autoTranslate }));
  };

  const resetAllSettings = () => {
    setState(defaultState);
  };

  const value: AccessibilityContextType = {
    ...state,
    toggleFeature,
    backToFeatures,
    setInterfaceLanguage,
    toggleDarkMode,
    setReaderSpeed,
    setReaderVoice,
    setFontSize,
    setInterfaceScale,
    setBrightness,
    setSourceLanguage,
    setTargetLanguage,
    toggleAutoTranslate,
    resetAllSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
