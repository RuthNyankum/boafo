export interface LanguageCodes {
  speech: string;    // For Speech-to-Text API (and possibly Text-to-Speech)
  tts: string;       // For Text-to-Speech API
  translate: string; // For Google Translate API
}

export const languageMapping: Record<string, LanguageCodes> = {
  "en-US": { speech: "en-US", tts: "en-US", translate: "en" },
  "ak":    { speech: "ak",    tts: "ak",    translate: "ak" },
  "gaa":   { speech: "gaa",   tts: "gaa",   translate: "gaa" },
  "dag":   { speech: "dag",   tts: "dag",   translate: "dag" },
  "ee":    { speech: "ee",    tts: "ee",    translate: "ee" },
  "fr":    { speech: "fr-FR", tts: "fr-FR", translate: "fr" },
  "es": { speech: "es-ES", tts: "es-ES", translate: "es" },
  "de": { speech: "de-DE", tts: "de-DE", translate: "de" },
  "it": { speech: "it-IT", tts: "it-IT", translate: "it" },
  "afrikaans": { speech: "af", tts: "af", translate: "af" },
};

export const getLanguageCodes = (selected: string): LanguageCodes => {
  return languageMapping[selected] || { speech: selected, tts: selected, translate: selected };
};