import { useCallback, useState } from 'react';
import { startTranscription, stopTranscription, pauseTranscription, resumeTranscription } from '../utils/speechToText';
import { useLanguage } from '../context/language.context';

export const useSpeechToText = () => {
  const { selectedLanguage } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleSpeechToText = useCallback(async () => {
    if (isProcessing || isTranscribing) return;
    try {
      setIsProcessing(true);
      const response = await startTranscription({ language: selectedLanguage });
      if (response.status === 'success') {
        setIsTranscribing(true);
        setIsPaused(false);
      }
    } catch (error) {
      console.error("Speech-to-text error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isTranscribing, selectedLanguage]);

  const handleStopTranscription = useCallback(async () => {
    // Optimistically update state immediately
    setIsTranscribing(false);
    setIsPaused(false);
    try {
      await stopTranscription();
    } catch (error) {
      console.error("Error stopping transcription:", error);
      // Optionally revert state here if needed
    }
  }, []);

  const handlePauseTranscription = useCallback(async () => {
    // Optimistically update state so UI shows pause immediately
    setIsPaused(true);
    try {
      await pauseTranscription();
    } catch (error) {
      console.error("Error pausing transcription:", error);
      setIsPaused(false);
    }
  }, []);

  const handleResumeTranscription = useCallback(async () => {
    // Optimistically update state so UI shows resume immediately
    setIsPaused(false);
    try {
      await resumeTranscription();
    } catch (error) {
      console.error("Error resuming transcription:", error);
      setIsPaused(true);
    }
  }, []);

  const handlePauseResume = useCallback(async () => {
    if (isPaused) {
      await handleResumeTranscription();
    } else {
      await handlePauseTranscription();
    }
  }, [isPaused, handlePauseTranscription, handleResumeTranscription]);

  return { 
    isProcessing, 
    isTranscribing, 
    isPaused,
    handleSpeechToText, 
    handleStopTranscription,
    handlePauseTranscription,
    handleResumeTranscription,
    handlePauseResume
  };
};
