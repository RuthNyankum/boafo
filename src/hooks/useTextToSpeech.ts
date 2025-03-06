import { useCallback, useState } from 'react';
import { readAloud, pauseReading, resumeReading, stopReading } from '../utils/textToSpeech';
import { useLanguage } from '../context/language.context';
import { useAccessibility } from '../context/AccessibilityContext';

export const useTextToSpeech = () => {
  const { selectedLanguage } = useLanguage();
  const { 
    readerSpeed, 
    readerVoice, 
    setReaderSpeed 
  } = useAccessibility();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(true);

  // Function to update the audio playback rate dynamically
  const updateAudioRate = useCallback((rate: number) => {
    chrome.runtime.sendMessage({ action: "updatePlaybackRate", rate });
  }, []);

  const handleTextToSpeech = useCallback(async () => {
    if (isProcessing || !isStopped) return;
    try {
      setIsProcessing(true);
      setIsStopped(false);
      setIsPaused(false);
      // Start the TTS with the current reader speed and voice
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

  // Increase the rate (capped at 2.0x)
  const increaseRate = useCallback(() => {
    const newRate = Math.min(readerSpeed + 0.1, 2.0);
    setReaderSpeed(newRate);
    if (!isStopped) {
      updateAudioRate(newRate);
    }
  }, [isStopped, readerSpeed, setReaderSpeed, updateAudioRate]);

  // Decrease the rate (capped at 0.5x)
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