// src/utils/languageTranslation.ts

import { getLanguageCodes } from "../utils/languageMapping";
import { translateText } from "../utils/translate";


export function injectTranslation(languageValue: string) {
  const codes = getLanguageCodes(languageValue);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        world: "MAIN",
        func: translateText,
        args: [codes.translate],
      });
    }
  });
}
