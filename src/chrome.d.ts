/// <reference types="chrome"/>

declare namespace chrome {
    export interface RuntimeEvent {
      addListener(
        callback: (
          message: unknown, 
          sender: chrome.runtime.MessageSender, 
          sendResponse: (response?: unknown) => void
        ) => boolean | void
      ): void;
    }
  }