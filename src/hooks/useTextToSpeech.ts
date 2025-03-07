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

  // Pauses the TTS process
  const handlePauseReading = useCallback(async () => {
    if (isStopped || isPaused) return;
    // Update state immediately to reflect the pause (icon will change to Play)
    setIsPaused(true);
    try {
      await pauseReading();
    } catch (error) {
      console.error("Error pausing reading:", error);
      // Revert state if there is an error
      setIsPaused(false);
    }
  }, [isStopped, isPaused]);
  
  // Resumes the TTS process if it was paused
  const handleResumeReading = useCallback(async () => {
    if (isStopped || !isPaused) return;
    // Update state immediately to reflect resume (icon will change to Pause)
    setIsPaused(false);
    try {
      await resumeReading();
    } catch (error) {
      console.error("Error resuming reading:", error);
      // Revert state if there is an error
      setIsPaused(true);
    }
  }, [isStopped, isPaused]);
  
  // Stops the TTS process and resets the state
  const handleStopReading = useCallback(async () => {
    if (isStopped) return;
    // Update states immediately to reflect stop
    setIsStopped(true);
    setIsPaused(false);
    try {
      await stopReading();
    } catch (error) {
      console.error("Error stopping reading:", error);
      // You might choose to revert state or handle error appropriately
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
    handlePauseReading, 
    handleResumeReading, 
    handleStopReading,
    increaseRate,
    decreaseRate
  };
};