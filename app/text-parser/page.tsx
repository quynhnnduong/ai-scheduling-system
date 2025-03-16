"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, Check } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
})

interface ParsedAppointment {
  customerName: string
  service: string
  date: string
  time: string
  phone?: string
  confidence: number
}

export default function TextParserPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedAppointment, setParsedAppointment] = useState<ParsedAppointment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [appointmentCreated, setAppointmentCreated] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true)
    setError(null)
    setAppointmentCreated(false)

    try {
      // Use AI to parse the text message
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: `Parse this text message for a nail salon appointment request: "${values.message}"
                Extract the following information in JSON format:
                - customerName: The name of the customer
                - service: The nail service requested
                - date: The date for the appointment
                - time: The time for the appointment
                - phone: The phone number if provided
                - confidence: A number between 0 and 1 indicating how confident you are in this parsing
                
                If you can't determine any field, use null for that field.
                If this doesn't appear to be an appointment request, set confidence to 0.
                
                Return ONLY valid JSON with no other text.`,
        system:
          "You are a helpful assistant that parses text messages to extract appointment information for a nail salon.",
      })

      try {
        // Parse the JSON response
        const parsed = JSON.parse(text)
        setParsedAppointment(parsed)

        if (parsed.confidence < 0.5) {
          setError("This message doesn't appear to be an appointment request or is missing key information.")
        }
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError)
        setError("Failed to parse the message. Please try again with a clearer message.")
      }
    } catch (aiError) {
      console.error("AI processing error:", aiError)
      setError("An error occurred while processing the message. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateAppointment = () => {
    // In a real app, this would create an appointment in the system
    console.log("Creating appointment:", parsedAppointment)
    setAppointmentCreated(true)
  }

  if (appointmentCreated) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-3 h-10 w-10" onClick={() => (window.location.href = "/")}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Text Message Parser</h1>
        </div>

        <Card className="p-6 text-center bg-primary/10 border-2 border-primary">
          <Check className="mx-auto h-16 w-16 text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-3">Appointment Created!</h3>
          <p className="text-lg mb-6">
            The appointment for {parsedAppointment?.customerName} on {parsedAppointment?.date} at{" "}
            {parsedAppointment?.time} has been scheduled.
          </p>
          <div className="flex gap-4 flex-col">
            <Button
              className="text-lg py-6"
              size="lg"
              onClick={() => {
                setAppointmentCreated(false)
                setParsedAppointment(null)
                form.reset()
              }}
            >
              Parse Another Message
            </Button>
            <Button variant="outline" className="text-lg py-6" size="lg" onClick={() => (window.location.href = "/")}>
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" className="mr-3 h-10 w-10" onClick={() => (window.location.href = "/")}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Text Message Parser</h1>
      </div>

      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            Convert Text Messages to Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Paste Text Message Here</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Copy and paste the customer's text message..."
                        className="min-h-[150px] text-lg"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Create Appointment from Text"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-destructive border-2">
          <CardContent className="p-4">
            <p className="text-destructive text-lg">{error}</p>
          </CardContent>
        </Card>
      )}

      {parsedAppointment && !error && (
        <Card className="mb-6 border-primary border-2">
          <CardHeader>
            <CardTitle className="text-xl">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-lg">
              <div className="flex justify-between">
                <dt className="font-medium">Customer:</dt>
                <dd>{parsedAppointment.customerName || "Unknown"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Service:</dt>
                <dd>{parsedAppointment.service || "Not specified"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Date:</dt>
                <dd>{parsedAppointment.date || "Not specified"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Time:</dt>
                <dd>{parsedAppointment.time || "Not specified"}</dd>
              </div>
              {parsedAppointment.phone && (
                <div className="flex justify-between">
                  <dt className="font-medium">Phone:</dt>
                  <dd>{parsedAppointment.phone}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="font-medium">Confidence:</dt>
                <dd>{Math.round(parsedAppointment.confidence * 100)}%</dd>
              </div>
            </dl>

            <Button
              className="w-full mt-6 text-lg py-6"
              size="lg"
              onClick={handleCreateAppointment}
              disabled={parsedAppointment.confidence < 0.5}
            >
              <Check className="mr-2 h-5 w-5" />
              Create This Appointment
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Example Messages to Try</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4 text-base"
              onClick={() =>
                form.setValue("message", "Hi, I'd like to book a gel manicure tomorrow at 2pm. This is Lisa.")
              }
            >
              "Hi, I'd like to book a gel manicure tomorrow at 2pm. This is Lisa."
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4 text-base"
              onClick={() => form.setValue("message", "Can I get a pedicure on Friday at 11am? Thanks, John")}
            >
              "Can I get a pedicure on Friday at 11am? Thanks, John"
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4 text-base"
              onClick={() =>
                form.setValue(
                  "message",
                  "Hello, I need to schedule a full set acrylic for Maria on Saturday morning, preferably around 10am.",
                )
              }
            >
              "Hello, I need to schedule a full set acrylic for Maria on Saturday morning, preferably around 10am."
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

