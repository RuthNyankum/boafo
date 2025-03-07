import { TranscriptionOptions, TranscriptionResponse } from "../types/accessibility";
import { getLanguageCodes } from "../utils/languageMapping";

export const startTranscription = async (
  options: TranscriptionOptions = {}
): Promise<TranscriptionResponse> => {
  try {
    // Use language mapping to get the correct speech-to-text code
    const languageCodes = getLanguageCodes(options.language || 'en-US');
    const response = await chrome.runtime.sendMessage({ 
      type: 'START_TRANSCRIPTION',
      language: languageCodes.speech
    });
    
    if (response?.status === 'success') {
      return {
        status: 'success',
        message: 'Speech recognition started'
      };
    } else {
      return {
        status: 'error',
        message: response?.message || 'Failed to start speech recognition'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const stopTranscription = async (): Promise<TranscriptionResponse> => {
  try {
    const response = await chrome.runtime.sendMessage({ 
      type: 'STOP_TRANSCRIPTION'
    });
    
    if (response?.status === 'success') {
      return {
        status: 'success',
        message: 'Speech recognition stopped'
      };
    } else {
      return {
        status: 'error',
        message: response?.message || 'Failed to stop speech recognition'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
export const pauseTranscription = async (): Promise<TranscriptionResponse> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ 
      type: 'PAUSE_TRANSCRIPTION'
    }, (response) => {
      if (response?.status === 'success') {
        resolve({
          status: 'success',
          message: 'Speech recognition paused'
        });
      } else {
        resolve({
          status: 'error',
          message: response?.message || 'Failed to pause speech recognition'
        });
      }
    });
  });
};

export const resumeTranscription = async (): Promise<TranscriptionResponse> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ 
      type: 'RESUME_TRANSCRIPTION'
    }, (response) => {
      if (response?.status === 'success') {
        resolve({
          status: 'success',
          message: 'Speech recognition resumed'
        });
      } else {
        resolve({
          status: 'error',
          message: response?.message || 'Failed to resume speech recognition'
        });
      }
    });
  });
};