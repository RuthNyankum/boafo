import { TTSResponse, TTSConfig } from '../types/accessibility';

export const readAloud = async ({
  mode = 'auto',
  language = 'en-US',
}: TTSConfig): Promise<TTSResponse> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error('No active tab found');
    }

    let text = '';
    if (mode === 'selection') {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection()?.toString() || '',
      });
      text = result || ''; // Ensure text is always a string
    }

    if (!text && mode === 'auto') {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText,
      });
      text = result || ''; // Ensure text is always a string
    }

    if (!text) {
      throw new Error('No text found to read');
    }

    return new Promise<TTSResponse>((resolve) => {
      chrome.tabs.sendMessage(
        tab.id!,
        {
          action: 'readText',
          text,
          lang: language,
        },
        (response: TTSResponse) => {
          resolve(response);
        }
      );
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in readAloud:', errorMessage);
    return { status: 'error', message: errorMessage };
  }
};

export const stopReading = async (): Promise<TTSResponse> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error('No active tab found');
    }

    return new Promise<TTSResponse>((resolve) => {
      chrome.tabs.sendMessage(
        tab.id!,
        { action: 'stopReading' },
        (response: TTSResponse) => {
          resolve(response);
        }
      );
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in stopReading:', errorMessage);
    return { status: 'error', message: errorMessage };
  }
};

export const pauseReading = async (): Promise<TTSResponse> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error('No active tab found');
    }

    return new Promise<TTSResponse>((resolve) => {
      chrome.tabs.sendMessage(
        tab.id!,
        { action: 'pauseReading' },
        (response: TTSResponse) => {
          resolve(response);
        }
      );
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in pauseReading:', errorMessage);
    return { status: 'error', message: errorMessage };
  }
};

export const resumeReading = async (): Promise<TTSResponse> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error('No active tab found');
    }

    return new Promise<TTSResponse>((resolve) => {
      chrome.tabs.sendMessage(
        tab.id!,
        { action: 'resumeReading' },
        (response: TTSResponse) => {
          resolve(response);
        }
      );
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in resumeReading:', errorMessage);
    return { status: 'error', message: errorMessage };
  }
};
