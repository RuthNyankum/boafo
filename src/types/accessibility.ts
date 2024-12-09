import { IconType } from "react-icons";

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