import { IconType } from 'react-icons';

export interface AccessibilityOption {
  title: string;
  description: string;
  icon: IconType;
  action: () => void;
}

export interface LanguageOption {
  lang: string;
  value: string;
}
export interface TranscriptionResponse {
  status: 'success' | 'error';
  message: string;
}

export interface TranscriptionOptions {
  language?: string;
}
export interface TextToSpeechResponse {
  status: 'success' | 'error';
  message: string;
  text?: string;
}

export interface TTSResponse {
  status: 'success' | 'error' | 'info';
  message: string;
}

export interface TTSConfig {
  mode?: 'auto' | 'selection';
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}




