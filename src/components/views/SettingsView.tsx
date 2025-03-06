/**
 * SettingsView component provides global application settings and user account management.
 * It allows users to manage their subscription, notification preferences, language settings,
 * and privacy options.
 */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, CreditCard, User, Globe, Shield, CheckCircle2, ChevronRight, Crown} from "lucide-react"
import { useAccessibility } from "../../context/AccessibilityContext"
import { SubscriptionPlan, ViewProps } from "../../types"
import { fadeInVariants } from "../ui/animations"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { BackButton } from "../ui/common"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"

export default function SettingsView({ onBack }: ViewProps) {
  // Local state for settings
  const [notifications, setNotifications] = useState(true)
  const [updates, setUpdates] = useState(true)
  const [dataCollection, setDataCollection] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>("free")

  // Access global accessibility settings
  const { interfaceLanguage } = useAccessibility()

  return (
    <motion.div variants={fadeInVariants} initial="initial" animate="animate" exit="exit" layout>
      <Card className="w-80 shadow-lg border-0 overflow-hidden relative">
        <CardHeader className="bg-green-600 text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BackButton onClick={onBack} />
            <span className="font-bold text-primary-foreground text-lg">Settings</span>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-[400px] overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Account Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="text-blue-300 h-4 w-4 text-accent" />
                <h2 className="font-semibold">Account</h2>
              </div>
              <div className="bg-muted/20 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Elvis Owusu</p>
                    <p className="text-xs text-muted-foreground">elvisgyasiowusu24@gmail.com</p>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-blue-300 ease-out duration-300 h-8 text-xs">
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="text-blue-600 h-4 w-4 text-accent" />
                <h2 className="font-semibold">Subscription</h2>
              </div>

              <RadioGroup
                value={currentPlan}
                onValueChange={(value) => setCurrentPlan(value as SubscriptionPlan)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem className="outline-none border-green-600 text-green-600" value="free" id="free" />
                  <Label
                    htmlFor="free"
                    className="flex flex-1 items-center justify-between cursor-pointer p-2 rounded-md hover:bg-muted/50"
                  >
                    <div>
                      <div className="font-medium">Free Plan</div>
                      <div className="text-xs text-muted-foreground">Basic accessibility features</div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      Current
                    </Badge>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem className="outline-none border-green-600 text-green-600"   value="pro" id="pro" />
                  <Label
                    htmlFor="pro"
                    className="flex flex-1 items-center justify-between cursor-pointer p-2 rounded-md hover:bg-muted/50"
                  >
                    <div>
                      <div className="font-medium flex items-center">
                        Pro Plan
                        <Crown className="h-3 w-3 text-yellow-500 ml-1" />
                      </div>
                      <div className="text-xs text-muted-foreground">Advanced features & priority support</div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      $5.99/mo
                    </Badge>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem className="outline-none border-green-600 text-green-600"  value="team" id="team" />
                  <Label
                    htmlFor="team"
                    className="flex flex-1 items-center justify-between cursor-pointer p-2 rounded-md hover:bg-muted/50"
                  >
                    <div>
                      <div className="font-medium flex items-center">
                        Team Plan
                        <Crown className="h-3 w-3 text-yellow-500 ml-1" />
                      </div>
                      <div className="text-xs text-muted-foreground">For organizations, up to 10 users</div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      $29.99/mo
                    </Badge>
                  </Label>
                </div>
              </RadioGroup>

              <div className="pt-2">
                <Button variant="outline" size="sm" className="hover:bg-green-500 hover:text-white w-full text-xs">
                  Manage Subscription
                </Button>
              </div>
            </div>

            <Separator />

            {/* Pro Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <h2 className="font-semibold">Pro Features</h2>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-600 h-4 w-4 text-primary" />
                  <span>Advanced language translation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-600 h-4 w-4 text-primary" />
                  <span>Custom voice profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-600 h-4 w-4 text-primary" />
                  <span>Offline mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-600 h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </div>
              </div>

              <Button variant="default" size="sm" className="w-full text-xs bg-green-600 text-white" disabled={currentPlan !== "free"}>
                {currentPlan === "free" ? "Upgrade to Pro" : "Already on Pro Plan"}
              </Button>
            </div>

            <Separator />

            {/* Notifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Bell className="text-blue-600 h-4 w-4 text-accent" />
                <h2 className="font-semibold">Notifications</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-sm cursor-pointer">
                    Enable notifications
                  </Label>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    aria-label="Toggle notifications"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="updates" className="text-sm cursor-pointer">
                    Update alerts
                  </Label>
                  <Switch
                    id="updates"
                    checked={updates}
                    onCheckedChange={setUpdates}
                    aria-label="Toggle update notifications"
                  />
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="text-blue-600 h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1 text-xs">
                <span>{interfaceLanguage === "en" ? "English" : interfaceLanguage}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Privacy */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="text-blue-600  h-4 w-4 text-accent" />
                <h2 className="font-semibold">Privacy</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-collection" className="text-sm cursor-pointer">
                    Allow anonymous data collection
                  </Label>
                  <Switch
                    id="data-collection"
                    checked={dataCollection}
                    onCheckedChange={setDataCollection}
                    aria-label="Toggle data collection"
                  />
                </div>
                <Button variant="link" size="sm" className="h-8 p-0 text-xs">
                  Privacy Policy
                </Button>
              </div>
            </div>

            {/* App Info */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>Boafo Accessibility Assistant</p>
              <p>Version 1.2.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

