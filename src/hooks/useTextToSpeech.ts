import { useCallback, useState } from 'react';
import { readAloud, pauseReading, resumeReading, stopReading } from '../utils/textToSpeech';
import { useLanguage } from '../context/language.context';
import { useAccessibility } from '../context/AccessibilityContext';

// This hook manages the Text-to-Speech state and actions.
export const useTextToSpeech = () => {
  // Global language setting from LanguageContext
  const { selectedLanguage } = useLanguage();
  // TTS settings from Accessibility context
  const { readerSpeed, readerVoice, setReaderSpeed } = useAccessibility();

  // Local state for process control
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(true);

  // Function to update playback rate on the background (for live TTS changes)
  const updateAudioRate = useCallback((rate: number) => {
    chrome.runtime.sendMessage({ action: "updatePlaybackRate", rate });
  }, []);

  // Starts the text-to-speech process using current language, rate, and voice.
  const handleTextToSpeech = useCallback(async () => {
    if (isProcessing || !isStopped) return;
    try {
      setIsProcessing(true);
      setIsStopped(false);
      setIsPaused(false);
      // Start the TTS process
      await readAloud({ 
        language: selectedLanguage, 
        rate: readerSpeed, 
        voiceType: readerVoice 
      });
    } catch (error) {
      console.error("Text-to-speech error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isStopped, selectedLanguage, readerSpeed, readerVoice]);

  // Toggles between pausing and resuming TTS
  const handlePauseResume = useCallback(async () => {
    if (isStopped) return;
    try {
      if (isPaused) {
        await resumeReading();
        setIsPaused(false);
      } else {
        await pauseReading();
        setIsPaused(true);
      }
    } catch (error) {
      console.error("Error toggling pause/resume:", error);
    }
  }, [isPaused, isStopped]);

  // Stops the TTS process
  const handleStopReading = useCallback(async () => {
    if (isStopped) return;
    try {
      await stopReading();
      setIsStopped(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Error stopping reading:", error);
    }
  }, [isStopped]);

  // Increase the playback rate (capped at 2.0x)
  const increaseRate = useCallback(() => {
    const newRate = Math.min(readerSpeed + 0.1, 2.0);
    setReaderSpeed(newRate);
    if (!isStopped) {
      updateAudioRate(newRate);
    }
  }, [isStopped, readerSpeed, setReaderSpeed, updateAudioRate]);

  // Decrease the playback rate (capped at 0.5x)
  const decreaseRate = useCallback(() => {
    const newRate = Math.max(readerSpeed - 0.1, 0.5);
    setReaderSpeed(newRate);
    if (!isStopped) {
      updateAudioRate(newRate);
    }
  }, [isStopped, readerSpeed, setReaderSpeed, updateAudioRate]);

  return { 
    isProcessing, 
    isPaused, 
    isStopped, 
    speechRate: readerSpeed, 
    handleTextToSpeech, 
    handlePauseResume, 
    handleStopReading,
    increaseRate,
    decreaseRate
  };
};
