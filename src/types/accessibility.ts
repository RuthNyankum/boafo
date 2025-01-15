import { IconType } from 'react-icons';

export interface AccessibilityOption {
  title: string;
  description: string;
  icon: IconType;
  action: () => void | Promise<void>;
}

export interface LanguageOption {
  lang: string;
  value: string;
}

export interface TextToSpeechResponse {
  status: 'success' | 'error';
  message: string;
  text?: string;
}

export interface SpeechToTextResponse {
  status: 'success' | 'error';
  message: string;
}