import { useCallback, useState } from 'react';
import { 
  startTranscription, 
  stopTranscription, 
  pauseTranscription, 
  resumeTranscription 
} from '../utils/speechToText';
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
      }
    } catch (error) {
      console.error("Speech-to-text error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isTranscribing, selectedLanguage]);

  const handleStopTranscription = useCallback(async () => {
    try {
      await stopTranscription();
      setIsTranscribing(false);
      setIsPaused(false);
    } catch (error) {
      console.error("Error stopping transcription:", error);
    }
  }, []);

  const handlePauseTranscription = useCallback(async () => {
    try {
      await pauseTranscription();
      setIsPaused(true);
    } catch (error) {
      console.error("Error pausing transcription:", error);
    }
  }, []);

  const handleResumeTranscription = useCallback(async () => {
    try {
      await resumeTranscription();
      setIsPaused(false);
    } catch (error) {
      console.error("Error resuming transcription:", error);
    }
  }, []);

  return { 
    isProcessing, 
    isTranscribing, 
    isPaused,
    handleSpeechToText, 
    handleStopTranscription,
    handlePauseTranscription,
    handleResumeTranscription 
  };
};
