"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Languages, Wand2, SwitchCamera } from "lucide-react";
import { ViewProps } from "../../types";
import { fadeInVariants } from "../ui/animations";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { BackButton, SettingHeader, StatusCard } from "../ui/common";
import LanguageSelector from "../AccessibilityOptions/LanguageSelector";

// Import language context to derive the default language (source)
import { useLanguage } from "../../context/language.context";
// Import accessibility context (which receives the default language)
import { useAccessibility } from "../../context/AccessibilityContext";
// Import the speech-to-text hook
import { useSpeechToText } from "../../hooks/useSpeechToText";

export default function HearingImpairmentView({ onBack }: ViewProps) {
  // Get global accessibility settings (now uses interfaceLanguage for consistency)
  const { targetLanguage, autoTranslate, setTargetLanguage, toggleAutoTranslate } =
    useAccessibility();

  // Get the selected language from the global language context
  const { selectedLanguage, langOptions } = useLanguage();
  const currentLanguageOption = langOptions.find(option => option.value === selectedLanguage);
  const currentLanguageLabel = currentLanguageOption ? currentLanguageOption.lang : selectedLanguage;
  // Use speech-to-text hook
  const { isProcessing, isTranscribing, handleSpeechToText, handleStopTranscription } = useSpeechToText();

  return (
    <motion.div variants={fadeInVariants} initial="initial" animate="animate" exit="exit" layout>
      <Card className="w-80 shadow-lg border-0 overflow-hidden relative">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute top-40 -right-8 w-32 h-32">
            <Languages className="w-full h-full text-primary" strokeWidth={0.5} />
          </motion.div>
        </div>

        {/* Header displays a badge with the selected language */}
        <CardHeader className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BackButton onClick={onBack} />
              <span className="font-bold text-white text-lg">Hearing Impairment</span>
            </div>
            {/* Show selected language from global settings */}
            <div className="px-2 py-1 bg-white bg-opacity-30 backdrop-blur-sm rounded text-xs text-gray-800">
              {currentLanguageLabel}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Transcription Controls */}
          <div className="space-y-3">
            <SettingHeader icon={Mic} title="Transcription Controls" />
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                {!isTranscribing ? (
                  <motion.div key="start" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", duration: 0.5 }}>
                    <Button
                      variant="default"
                      size="lg"
                      className="h-16 bg-green-600 hover:bg-green-500 text-white px-6 rounded-full text-base font-medium focus:ring-4 focus:ring-green-300 relative overflow-hidden"
                      onClick={handleSpeechToText}
                      aria-label="Start transcribing"
                      disabled={isProcessing}
                    >
                      <motion.div className="absolute inset-0 bg-green-600/10" animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }} />
                      <Mic className="h-5 w-5 mr-2" />
                      {isProcessing ? "Starting..." : "Start Transcribing"}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="stop" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", duration: 0.5 }}>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="h-16 px-6 bg-red-600 hover:bg-red-500 text-white rounded-full text-base font-medium focus:ring-4 focus:ring-red-300"
                      onClick={handleStopTranscription}
                      aria-label="Stop transcribing"
                    >
                      <SwitchCamera className="h-5 w-5 mr-2" />
                      Stop Transcribing
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Language Settings */}
          <div className="space-y-4">
            <SettingHeader icon={Languages} title="Language Settings" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-blue-600 text-accent" />
                  Auto-Translate
                </Label>
                <Switch checked={autoTranslate} onCheckedChange={toggleAutoTranslate} aria-label="Toggle auto-translation" className="bg-gray-200" />
              </div>
              <AnimatePresence>
                {autoTranslate && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                    <div className="space-y-2 pt-2">
                      <Label className="text-base">Target Language</Label>
                      <LanguageSelector value={targetLanguage} onChange={setTargetLanguage} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <AnimatePresence mode="wait">
          {isTranscribing ? (
            <StatusCard title="Current Status" statusText="Transcribing audio..." isActive={isTranscribing} />
          ) : (
            <motion.div key="help" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CardFooter className="flex justify-between p-4 bg-gray-100">
                <div className="text-sm text-muted-foreground text-center w-full">Select your language preferences and press Start Transcribing to begin</div>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
