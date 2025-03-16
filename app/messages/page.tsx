"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageSquare, Send } from "lucide-react"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Sample conversation data
const SAMPLE_CONVERSATIONS = [
  {
    id: "1",
    contact: "+1 555-789-1234",
    name: "Lisa",
    lastMessage: "Hi, I'd like to book a gel manicure tomorrow at 2pm. This is Lisa.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: true,
  },
  {
    id: "2",
    contact: "+1 555-321-8765",
    name: "John",
    lastMessage: "Can I get a pedicure on Friday at 11am? Thanks, John",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: true,
  },
  {
    id: "3",
    contact: "+1 555-555-5555",
    name: "Maria",
    lastMessage: "Thanks for confirming my appointment!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: false,
  },
  {
    id: "4",
    contact: "+1 555-444-3333",
    name: "Alex",
    lastMessage: "Do you have any openings for a manicure this Saturday?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: false,
  },
]

// Sample messages for a conversation
const SAMPLE_MESSAGES = [
  {
    id: "1",
    sender: "customer",
    content: "Hi, I'd like to book a gel manicure tomorrow at 2pm. This is Lisa.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState(SAMPLE_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAppointmentOptions, setShowAppointmentOptions] = useState(false)

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id)
    // Mark as read
    setConversations(conversations.map((conv) => (conv.id === id ? { ...conv, unread: false } : conv)))

    // Check if this is a booking request
    const conversation = conversations.find((c) => c.id === id)
    if (conversation && conversation.lastMessage.toLowerCase().includes("book")) {
      setShowAppointmentOptions(true)
    } else {
      setShowAppointmentOptions(false)
    }
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
    setShowAppointmentOptions(false)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: "salon",
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setNewMessage("")
    setIsProcessing(true)

    try {
      // In a real app, this would send an SMS via a service like Twilio
      console.log("Sending message:", newMessage)

      // Simulate AI processing the message to detect appointment requests
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: `Analyze this message from a nail salon to a customer: "${newMessage}". 
                If it's confirming an appointment, summarize the details. 
                If it's asking a question, suggest how the customer might respond.
                Keep it very brief.`,
        system: "You are a helpful assistant for a nail salon.",
      })

      // In a real app, we might use this analysis to update the appointment system
      console.log("AI analysis:", text)

      // Update the conversation list
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation ? { ...conv, lastMessage: newMessage, timestamp: new Date() } : conv,
        ),
      )
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateAppointment = () => {
    // In a real app, this would extract appointment details and create an appointment
    alert("Appointment created successfully!")
    setShowAppointmentOptions(false)

    // Add confirmation message
    const confirmationMessage = {
      id: Date.now().toString(),
      sender: "salon",
      content: "Your appointment for a gel manicure tomorrow at 2pm has been confirmed. We look forward to seeing you!",
      timestamp: new Date(),
    }

    setMessages([...messages, confirmationMessage])

    // Update conversation
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: "Your appointment has been confirmed.",
              timestamp: new Date(),
              unread: false,
            }
          : conv,
      ),
    )
  }

  // Get selected conversation details
  const currentConversation = conversations.find((conv) => conv.id === selectedConversation)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground p-4">
        <div className="flex items-center">
          {selectedConversation ? (
            <>
              <Button variant="secondary" size="icon" className="mr-3 h-10 w-10" onClick={handleBackToList}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <div className="text-xl font-bold">{currentConversation?.name || currentConversation?.contact}</div>
                <div className="text-sm">{currentConversation?.contact}</div>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="mr-3 h-10 w-10"
                onClick={() => (window.location.href = "/")}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-bold">Messages</h1>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-24">
        {selectedConversation ? (
          // Conversation view
          <>
            {showAppointmentOptions && (
              <Card className="mb-4 border-primary border-2 bg-primary/10">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2">Appointment Request Detected</h3>
                  <p className="mb-3">This message appears to be a booking request. Would you like to:</p>
                  <div className="flex flex-col gap-2">
                    <Button size="lg" className="text-base py-6" onClick={handleCreateAppointment}>
                      Create Appointment Automatically
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-base py-6"
                      onClick={() => (window.location.href = "/add-appointment")}
                    >
                      Create Appointment Manually
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-base py-6"
                      onClick={() => setShowAppointmentOptions(false)}
                    >
                      Just Reply to Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "salon" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 text-base ${
                        message.sender === "salon" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={isProcessing}
                  className="text-base py-6"
                />
                <Button
                  size="icon"
                  className="h-14 w-14"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isProcessing}
                >
                  <Send className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Conversations list
          <ScrollArea className="h-[calc(100vh-180px)]">
            {conversations.length === 0 ? (
              <div className="text-center py-10">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl">No messages</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <Card
                    key={conversation.id}
                    className={`cursor-pointer hover:bg-accent/50 ${conversation.unread ? "border-primary border-2" : ""}`}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="text-lg font-bold">
                          {conversation.name || conversation.contact}
                          {conversation.unread && (
                            <span className="ml-2 h-3 w-3 rounded-full bg-primary inline-block"></span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {conversation.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <p className="text-base text-muted-foreground line-clamp-2 mt-1">{conversation.lastMessage}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </main>

      {/* Simple bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2">
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center py-3 h-auto"
            onClick={() => (window.location.href = "/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-1"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-sm">Home</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-3 h-auto text-primary"
            onClick={() => (window.location.href = "/messages")}
          >
            <MessageSquare className="mb-1 h-6 w-6" />
            <span className="text-sm">Messages</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-3 h-auto"
            onClick={() => (window.location.href = "/customers")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-1"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-sm">Customers</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-3 h-auto"
            onClick={() => (window.location.href = "/help")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-1"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span className="text-sm">Help</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

