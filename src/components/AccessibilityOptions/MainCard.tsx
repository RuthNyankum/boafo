"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Ear, EyeOff, Moon, HelpCircle, Languages } from "lucide-react"
import LanguageSelector from "./LanguageSelector"
import { useLanguage } from "../../context/language.context"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { fadeInVariants } from "../ui/animations"
import { injectTranslation } from "../../hooks/languageTranslation"

interface MainCardProps {
  onScreenReaderClick: () => void
  onHearingClick: () => void
  onEyeStrainClick: () => void
  onHelpClick: () => void
  onSettingsClick: () => void
}

export default function MainCard({
  onScreenReaderClick,
  onHearingClick,
  onEyeStrainClick,
  onHelpClick,
  onSettingsClick,
}: MainCardProps) {
  // Control whether the language selector dropdown is open
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  // Get language context values
  const { selectedLanguage, setSelectedLanguage, langOptions } = useLanguage()

  // Derive display name from langOptions
  const currentOption = langOptions.find(option => option.value === selectedLanguage)
  const currentLanguageLabel = currentOption ? currentOption.lang : selectedLanguage

  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className="w-[20rem]"
    >
      <Card className="shadow-lg border-0 overflow-hidden">
        {/* Header with green background */}
        <CardHeader className="bg-green-600 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-lg">Boafo</span>
            <div className="flex items-center gap-2">
              {/* Badge displaying the current language */}
              <span className="text-xs text-white bg-black/20 px-2 py-1 rounded">
                {currentLanguageLabel}
              </span>
              {/* Toggle language selector */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                aria-label="Change language"
              >
                <Languages className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
              {/* Settings button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={onSettingsClick}
                aria-label="Open settings"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </div>

          {/* Language selector dropdown */}
          {showLanguageSelector && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <LanguageSelector
                value={selectedLanguage}
                onChange={(value) => {
                  setSelectedLanguage(value)
                  setShowLanguageSelector(false);
                  // Inject translation to the active tab
                  injectTranslation(value);
                }}
              />
            </motion.div>
          )}
        </CardHeader>

        {/* Main feature buttons */}
        <CardContent className="p-0">
          <Button
            variant="ghost"
            className="justify-start w-full rounded-none h-17 px-4 py-6 hover:bg-gray-50"
            onClick={onHearingClick}
            aria-label="Hearing impairment settings"
          >
            <Ear className="mr-3 h-5 w-5 text-blue-600" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Hearing Impairment</span>
              <span className="text-xs text-gray-500">Captions, audio enhancements</span>
            </div>
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="justify-start w-full rounded-none h-17 px-4 py-6 hover:bg-gray-50"
            onClick={onScreenReaderClick}
            aria-label="Visual impairment settings"
          >
            <EyeOff className="mr-3 h-5 w-5 text-blue-600" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Visual Impairment</span>
              <span className="text-xs text-gray-500">Screen reader, magnification</span>
            </div>
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="justify-start w-full rounded-none h-17 px-4 py-6 hover:bg-gray-50"
            onClick={onEyeStrainClick}
            aria-label="Eye strain and interface settings"
          >
            <Moon className="mr-3 h-5 w-5 text-blue-600" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Eye Strain & Interface</span>
              <span className="text-xs text-gray-500">Dark mode, contrast, font size</span>
            </div>
          </Button>
        </CardContent>

        {/* Footer with Help button */}
        <CardFooter className="flex justify-end p-4 bg-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={onHelpClick}
            aria-label="View help and tutorials"
          >
            <HelpCircle className="mr-2 h-3.5 w-3.5" />
            Help & Tutorials
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
