/**
 * HelpTutorialsView component provides documentation, tutorials, and help resources
 * for users to learn how to use the accessibility features effectively.
 */
"use client"

import { motion } from "framer-motion"
import { BookOpen, Lightbulb, Video, FileText, ExternalLink } from "lucide-react"
import { ViewProps } from "../../types"
import { fadeInVariants } from "../ui/animations"
import { Card, CardContent, CardHeader } from "../ui/card"
import { BackButton } from "../ui/common"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Separator } from "../ui/separator"

export default function HelpTutorialsView({ onBack }: ViewProps) {
  return (
    <motion.div variants={fadeInVariants} initial="initial" animate="animate" exit="exit" layout>
      <Card className="w-80 shadow-lg border-0 overflow-hidden relative">
        <CardHeader className="bg-green-600 text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BackButton onClick={onBack} />
            <span className="font-bold text-primary-foreground text-lg">Help & Tutorials</span>
          </div>
        </CardHeader>

        <Tabs defaultValue="getting-started" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid bg-gray-100 w-full grid-cols-3">
              <TabsTrigger value="getting-started">Basics</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-4 h-[400px] overflow-y-auto">
            {/* Getting Started Tab */}
            <TabsContent value="getting-started" className="space-y-4 mt-0">
              <div className="flex items-center text-green-600 gap-2 text-lg font-semibold text-primary">
                <BookOpen className=" h-5 w-5" />
                <h2>Getting Started</h2>
              </div>

              <div className="space-y-4 text-sm">
                <p>
                  Welcome to Boafo, your comprehensive accessibility assistant. This guide will help you get started
                  with the basic features and navigation.
                </p>

                <div className="bg-muted/30 p-3 rounded-md">
                  <h3 className="font-medium mb-2">Quick Navigation</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use the main menu to access different accessibility features</li>
                    <li>Each feature has its own dedicated settings panel</li>
                    <li>The back button (top-left) returns you to the main menu</li>
                    <li>Settings icon (top-right) opens global application settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">First Steps</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Choose your accessibility need</span>
                      <p className="text-muted-foreground mt-1">
                        Select from hearing, visual, or interface options based on your requirements
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Configure your settings</span>
                      <p className="text-muted-foreground mt-1">
                        Each module has customizable options to match your specific needs
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Activate the feature</span>
                      <p className="text-muted-foreground mt-1">
                        Use the start buttons to enable the accessibility assistance
                      </p>
                    </li>
                  </ol>
                </div>

                <div className="bg-primary/5 p-3 bg-green-50 rounded-md">
                  <h3 className="font-medium mb-2">Need More Help?</h3>
                  <p>
                    Check out our detailed tutorials section or contact support through the settings menu for
                    personalized assistance.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-4 mt-0">
              <div className="flex text-green-600 items-center gap-2 text-lg font-semibold text-primary">
                <Lightbulb className="h-5 w-5" />
                <h2>Features Guide</h2>
              </div>

              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="font-medium mb-2 text-base">Hearing Impairment Tools</h3>
                  <Separator className="my-2" />
                  <ul className="space-y-3">
                    <li>
                      <div className="font-medium">Live Transcription</div>
                      <p className="text-muted-foreground">
                        Converts spoken audio to text in real-time, making it easier to follow conversations and media
                        content
                      </p>
                    </li>
                    <li>
                      <div className="font-medium">Auto-Translation</div>
                      <p className="text-muted-foreground">
                        Translates transcribed content into your preferred language instantly
                      </p>
                    </li>
                    <li>
                      <div className="font-medium">Language Selection</div>
                      <p className="text-muted-foreground">
                        Choose from multiple source and target languages for transcription and translation
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-base">Visual Impairment Tools</h3>
                  <Separator className="my-2" />
                  <ul className="space-y-3">
                    <li>
                      <div className="font-medium">Screen Reader</div>
                      <p className="text-muted-foreground">
                        Reads on-screen content aloud with adjustable speed and voice options
                      </p>
                    </li>
                    <li>
                      <div className="font-medium">Reading Controls</div>
                      <p className="text-muted-foreground">
                        Play, pause, and stop controls for the screen reader with customizable reading speed
                      </p>
                    </li>
                    <li>
                      <div className="font-medium">Voice Selection</div>
                      <p className="text-muted-foreground">
                        Choose from different voice types to match your preference
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-base">Eye Strain & Interface Tools</h3>
                  <Separator className="my-2" />
                  <ul className="space-y-3">
                    <li>
                      <div className="font-medium">Interface Scaling</div>
                      <p className="text-muted-foreground">
                        Adjust the size of the entire interface to improve visibility
                      </p>
                    </li>
                    <li>
                      <div className="font-medium">Font Size Control</div>
                      <p className="text-muted-foreground">Increase or decrease text size for better readability</p>
                    </li>
                    <li>
                      <div className="font-medium">Brightness Adjustment</div>
                      <p className="text-muted-foreground">Control screen brightness to reduce eye strain</p>
                    </li>
                    <li>
                      <div className="font-medium">Dark Mode</div>
                      <p className="text-muted-foreground">
                        Toggle between light and dark themes to suit your visual comfort
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials" className="space-y-4 mt-0">
              <div className="flex text-green-600 items-center gap-2 text-lg font-semibold text-primary">
                <Video className="h-5 w-5" />
                <h2>Video Tutorials</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-muted/30 p-3 rounded-md">
                  <h3 className="font-medium mb-2">How to Use Boafo</h3>
                  <div className="aspect-video bg-black/10 rounded-md flex items-center justify-center mb-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span>Play Video</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A comprehensive overview of all Boafo features and how to navigate the interface
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Feature-specific Tutorials</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Video className="text-green-600 h-4 w-4 text-primary" />
                      <span>Setting up the Screen Reader</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Video className="text-green-600 h-4 w-4 text-primary" />
                      <span>Using Live Transcription</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Video className="text-green-600 h-4 w-4 text-primary" />
                      <span>Customizing Interface Settings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Video className="text-green-600 h-4 w-4 text-primary" />
                      <span>Language Translation Features</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Documentation</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <FileText className="text-green-600 h-4 w-4 text-primary" />
                      <span>User Manual</span>
                      <ExternalLink className="text-green-600 h-3 w-3 ml-1 text-muted-foreground" />
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 text-green-600 w-4 text-primary" />
                      <span>Keyboard Shortcuts</span>
                      <ExternalLink className="text-green-600 h-3 w-3 ml-1 text-muted-foreground" />
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="text-green-600 h-4 w-4 text-primary" />
                      <span>Troubleshooting Guide</span>
                      <ExternalLink className="text-green-600 h-3 w-3 ml-1 text-muted-foreground" />
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 p-3 rounded-md mt-6">
                  <h3 className="font-medium mb-2">Community Support</h3>
                  <p>
                    Join our community forum to connect with other users, share experiences, and get additional help
                    with using Boafo.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary mt-1">
                    Visit Community Forum
                    <ExternalLink className="text-green-600 h-3 w-3 ml-1" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground mt-6 pt-4 border-t">
                  <p>
                    All tutorial content is available with closed captions and transcripts. If you need additional
                    accessibility options, please contact our support team.
                  </p>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}

