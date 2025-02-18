import { useCallback, useState } from 'react';
import { readAloud, pauseReading, resumeReading, stopReading } from '../utils/textToSpeech';
import { useLanguage } from '../context/language.context';

export const useTextToSpeech = () => {
  const { selectedLanguage } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(true);

  const handleTextToSpeech = useCallback(async () => {
    if (isProcessing || !isStopped) return;
    try {
      setIsProcessing(true);
      setIsStopped(false);
      setIsPaused(false);
      await readAloud({ language: selectedLanguage });
    } catch (error) {
      console.error("Text-to-speech error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isStopped, selectedLanguage]);

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

  return { isProcessing, isPaused, isStopped, handleTextToSpeech, handlePauseResume, handleStopReading };
};