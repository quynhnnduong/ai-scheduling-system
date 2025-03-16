"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mic, MicOff, Volume2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { VoiceTranscript } from "./voice-transcript"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your nail salon assistant. How can I help you today?" },
  ])
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock SpeechRecognition for the demo
  useEffect(() => {
    if (isListening) {
      // In a real app, this would use the Web Speech API
      const mockRecognitionTimeout = setTimeout(() => {
        const mockPhrases = [
          "I'd like to schedule a manicure for tomorrow at 2 PM",
          "Can you book a pedicure for Sarah Johnson on Friday?",
          "I need to cancel my appointment for today",
          "What services do you offer?",
          "How long does a gel manicure take?",
        ]
        const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)]
        setTranscript(randomPhrase)
        handleVoiceInput(randomPhrase)
        setIsListening(false)
      }, 3000)

      return () => clearTimeout(mockRecognitionTimeout)
    }
  }, [isListening])

  // Process voice input
  const handleVoiceInput = async (input: string) => {
    if (!input.trim()) return

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setIsProcessing(true)

    try {
      // In a real app, this would use a more sophisticated AI model
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: `You are a nail salon assistant. Respond to this customer request: ${input}. 
                Keep responses short, friendly, and helpful. If they want to book an appointment,
                confirm you can help with that.`,
        system: "You are a helpful nail salon assistant that helps with scheduling and answering questions.",
      })

      // Add AI response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: text }])

      // In a real app, this would use the Web Speech API for text-to-speech
      speakResponse(text)
    } catch (error) {
      console.error("Error processing voice input:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I couldn't process that request. Could you try again?",
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  // Mock text-to-speech function
  const speakResponse = (text: string) => {
    // In a real app, this would use the Web Speech API
    console.log("Speaking:", text)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTranscript("")
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Voice Assistant</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Nail Salon Voice Assistant
            </CardTitle>
            <CardDescription>Speak to schedule appointments or ask questions about our services</CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceTranscript messages={messages} />

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                className={`rounded-full p-8 ${isListening ? "bg-destructive hover:bg-destructive/90" : "bg-primary"}`}
                onClick={toggleListening}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                <span className="sr-only">{isListening ? "Stop Listening" : "Start Listening"}</span>
              </Button>
            </div>

            <div className="mt-4 text-center">
              {isListening ? (
                <p className="text-primary animate-pulse">Listening...</p>
              ) : isProcessing ? (
                <p className="text-muted-foreground">Processing...</p>
              ) : (
                <p className="text-muted-foreground">Press the microphone button to speak</p>
              )}
              {transcript && !isProcessing && <p className="mt-2 font-medium">{transcript}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voice Commands</CardTitle>
            <CardDescription>Try these example phrases</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" />
                "Schedule a manicure for tomorrow at 2 PM"
              </li>
              <li className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" />
                "Book a pedicure for Sarah on Friday afternoon"
              </li>
              <li className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" />
                "What nail services do you offer?"
              </li>
              <li className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" />
                "How long does a gel manicure take?"
              </li>
              <li className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" />
                "Cancel my appointment for today"
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

