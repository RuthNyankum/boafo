"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Mic, Languages, Wand2, SwitchCamera } from "lucide-react"
import { ViewProps } from "../../types"
import { fadeInVariants } from "../ui/animations"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { BackButton, SettingHeader, StatusCard } from "../ui/common"
import LanguageSelector from "../AccessibilityOptions/LanguageSelector"

// 1) Import your main accessibility context for source/target language, autoTranslate, etc.
// 2) Import the language context to retrieve display names
import { useLanguage } from "../../context/language.context"
// 3) Import the speech-to-text hook for actual transcription logic
import { useSpeechToText } from "../../hooks/useSpeechToText"
import { useAccessibility } from "../../context/AccessibilityContext"

export default function HearingImpairmentView({ onBack }: ViewProps) {
  // Get global STT settings from accessibility context
  const {
    sourceLanguage,
    targetLanguage,
    autoTranslate,
    setSourceLanguage,
    setTargetLanguage,
    toggleAutoTranslate,
  } = useAccessibility()

  // Get language context to derive display name for source language
  const { langOptions } = useLanguage()
  const currentSourceOption = langOptions.find(option => option.value === sourceLanguage)
  const currentSourceLanguageLabel = currentSourceOption ? currentSourceOption.lang : sourceLanguage

  // Use speech-to-text hook for transcription logic
  const {
    isProcessing,
    isTranscribing,
    handleSpeechToText,
    handleStopTranscription,
  } = useSpeechToText()

  return (
    <motion.div variants={fadeInVariants} initial="initial" animate="animate" exit="exit" layout>
      <Card className="w-80 shadow-lg border-0 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            className="absolute top-40 -right-8 w-32 h-32"
          >
            <Languages className="w-full h-full text-primary" strokeWidth={0.5} />
          </motion.div>
        </div>

        {/* Header with source language badge */}
        <CardHeader className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BackButton onClick={onBack} />
              <span className="font-bold text-white text-lg">Hearing Impairment</span>
            </div>
            {/* Badge showing currently selected source language */}
            <div className="px-2 py-1 bg-white bg-opacity-30 backdrop-blur-sm rounded text-xs text-gray-800">
              {currentSourceLanguageLabel}
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
                  // Start Button
                  <motion.div
                    key="start"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Button
                      variant="default"
                      size="lg"
                      className="h-16 bg-green-600 hover:bg-green-500 duration-300 text-white px-6 rounded-full text-base font-medium focus:ring-4 focus:ring-primary/30 relative overflow-hidden"
                      onClick={handleSpeechToText}
                      aria-label="Start transcribing"
                      disabled={isProcessing}
                    >
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                      />
                      <Mic className="h-5 w-5 mr-2" />
                      {isProcessing ? "Starting..." : "Start Transcribing"}
                    </Button>
                  </motion.div>
                ) : (
                  // Stop Button
                  <motion.div
                    key="stop"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Button
                      variant="destructive"
                      size="lg"
                      className="h-16 px-6 bg-red-600 hover:bg-red-500 duration-300 text-white rounded-full text-base font-medium focus:ring-4 focus:ring-destructive/30"
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Source Language</Label>
                <LanguageSelector value={sourceLanguage} onChange={setSourceLanguage} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-blue-600 text-accent" />
                    Auto-Translate
                  </Label>
                  <Switch
                    checked={autoTranslate}
                    onCheckedChange={toggleAutoTranslate}
                    aria-label="Toggle auto-translation"
                    className="bg-gray-200"
                  />
                </div>
                <AnimatePresence>
                  {autoTranslate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-2 pt-2">
                        <Label className="text-base">Target Language</Label>
                        <LanguageSelector value={targetLanguage} onChange={setTargetLanguage} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <AnimatePresence mode="wait">
          {isTranscribing ? (
            <StatusCard
              title="Current Status"
              statusText="Transcribing audio..."
              isActive={isTranscribing}
            />
          ) : (
            <motion.div
              key="help"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <CardFooter className="flex justify-between p-4 bg-gray-100">
                <div className="text-sm text-muted-foreground text-center w-full">
                  Select your language preferences and press Start Transcribing to begin
                </div>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
