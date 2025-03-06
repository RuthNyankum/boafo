/**
 * Type definitions for the Boafo accessibility extension
 */

// Available views in the application
export type ViewType = "main" | "screenReader" | "hearing" | "eyeStrain" | "help" | "settings"

// Common props for all view components
export interface ViewProps {
  onBack: () => void
}

// Language option type
export interface Language {
  value: string
  label: string
  popular: boolean
}

// Accessibility context state
export interface AccessibilityState {
  // General settings
  interfaceLanguage: string
  darkMode: boolean

  // Screen reader settings
  readerSpeed: number
  readerVoice: string

  // Hearing impairment settings
  sourceLanguage: string
  targetLanguage: string
  autoTranslate: boolean

  // Eye strain settings
  fontSize: number
  interfaceScale: number
  brightness: number
  letterSpacing: number
  lineHeight: number
}

// Accessibility context actions
export interface AccessibilityActions {
  setInterfaceLanguage: (language: string) => void
  toggleDarkMode: () => void
  setReaderSpeed: (speed: number) => void
  setReaderVoice: (voice: string) => void
  setSourceLanguage: (language: string) => void
  setTargetLanguage: (language: string) => void
  toggleAutoTranslate: () => void
  setFontSize: (size: number) => void
  setInterfaceScale: (scale: number) => void
  setBrightness: (brightness: number) => void
  setLetterSpacing: (spacing: number) => void
  setLineHeight: (height: number) => void
  resetAllSettings: () => void
}

// Combined accessibility context type
export interface AccessibilityContextType extends AccessibilityState, AccessibilityActions {}

// User subscription plan
export type SubscriptionPlan = "free" | "pro" | "team"

