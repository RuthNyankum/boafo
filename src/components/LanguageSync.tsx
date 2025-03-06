"use client"

import { useEffect } from 'react';
import { useLanguage } from '../context/language.context';
import { useAccessibility } from '../context/AccessibilityContext';

export default function LanguageSync() {
  const { selectedLanguage } = useLanguage();
  const { setInterfaceLanguage, setSourceLanguage } = useAccessibility();

  // Sync language changes to accessibility settings
  useEffect(() => {
    setInterfaceLanguage(selectedLanguage);
    setSourceLanguage(selectedLanguage);
  }, [selectedLanguage, setInterfaceLanguage, setSourceLanguage]);

  return null;
}