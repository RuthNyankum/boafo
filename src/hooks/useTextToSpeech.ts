import { useCallback, useState } from 'react';
import { readAloud, pauseReading, resumeReading, stopReading } from '../utils/textToSpeech';
import { useLanguage } from '../context/language.context';

export const useTextToSpeech = () => {
  const { selectedLanguage } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0); // initial speech rate

  const handleTextToSpeech = useCallback(async () => {
    if (isProcessing || !isStopped) return;
    try {
      setIsProcessing(true);
      setIsStopped(false);
      setIsPaused(false);
      // Pass the current speech rate to the TTS utility.
      await readAloud({ language: selectedLanguage, rate: speechRate });
    } catch (error) {
      console.error("Text-to-speech error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isStopped, selectedLanguage, speechRate]);

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

  // Increase speech rate (max capped at 2.0x)
  const increaseRate = useCallback(() => {
    setSpeechRate((prev) => Math.min(prev + 0.1, 2.0));
  }, []);

  // Decrease speech rate (min capped at 0.5x)
  const decreaseRate = useCallback(() => {
    setSpeechRate((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  return { 
    isProcessing, 
    isPaused, 
    isStopped, 
    speechRate, 
    handleTextToSpeech, 
    handlePauseResume, 
    handleStopReading,
    increaseRate,
    decreaseRate
  };
};
