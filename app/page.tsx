"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Mic,
  Phone,
  Plus,
  Search,
  UserPlus,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageNotification } from "@/components/message-notification"
import { format, isSameDay } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Sample appointment data - in a real app, this would come from a database
const SAMPLE_APPOINTMENTS = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    service: "Gel Manicure",
    time: "10:00 AM",
    duration: "45 min",
    phone: "555-123-4567",
    status: "confirmed",
    worker: "Helen",
  },
  {
    id: "2",
    customerName: "Michael Chen",
    service: "Pedicure",
    time: "11:30 AM",
    duration: "60 min",
    phone: "555-987-6543",
    status: "confirmed",
    worker: "Daniel",
  },
  {
    id: "3",
    customerName: "Jessica Williams",
    service: "Full Set Acrylic",
    time: "1:15 PM",
    duration: "90 min",
    phone: "555-456-7890",
    status: "confirmed",
    worker: "Trinh",
  },
  {
    id: "4",
    customerName: "David Rodriguez",
    service: "Pedicure",
    time: "3:00 PM",
    duration: "60 min",
    phone: "555-222-3333",
    status: "pending",
    worker: "Helen",
  },
]

// Sample text messages
const SAMPLE_MESSAGES = [
  {
    id: "1",
    from: "+1 555-789-1234",
    content: "Hi, I'd like to book a gel manicure tomorrow at 2pm. This is Lisa.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isNew: true,
  },
  {
    id: "2",
    from: "+1 555-321-8765",
    content: "Can I get a pedicure on Friday at 11am? Thanks, John",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isNew: true,
  },
]

// Common services with descriptions
const SERVICES = [
  {
    id: "gel-manicure",
    name: "Gel Manicure",
    description: "Long-lasting gel polish that doesn't chip for 2-3 weeks",
    duration: "45 min",
  },
  {
    id: "regular-manicure",
    name: "Regular Manicure",
    description: "Traditional manicure with regular nail polish",
    duration: "30 min",
  },
  {
    id: "pedicure",
    name: "Pedicure",
    description: "Foot treatment with regular nail polish",
    duration: "60 min",
  },
  {
    id: "gel-pedicure",
    name: "Gel Pedicure",
    description: "Foot treatment with long-lasting gel polish",
    duration: "75 min",
  },
  {
    id: "full-set-acrylic",
    name: "Full Set Acrylic",
    description: "Application of artificial nail extensions",
    duration: "90 min",
  },
  {
    id: "nail-art",
    name: "Nail Art",
    description: "Decorative designs on nails",
    duration: "60 min",
  },
  {
    id: "polish-change",
    name: "Polish Change",
    description: "Quick change of nail polish only",
    duration: "15 min",
  },
  {
    id: "manicure-pedicure",
    name: "Manicure & Pedicure",
    description: "Combined manicure and pedicure service",
    duration: "90 min",
  },
]

// Time slots from 8am to 9pm
const TIME_SLOTS = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
]

// Workers
const WORKERS = [
  { id: "helen", name: "Helen" },
  { id: "daniel", name: "Daniel" },
  { id: "trinh", name: "Trinh" },
  { id: "store", name: "Any Available" },
]

// Sample frequent customers
const SAMPLE_CUSTOMERS = [
  { id: "1", name: "Sarah Johnson", phone: "555-123-4567" },
  { id: "2", name: "Michael Chen", phone: "555-987-6543" },
  { id: "3", name: "Jessica Williams", phone: "555-456-7890" },
  { id: "4", name: "David Rodriguez", phone: "555-222-3333" },
  { id: "5", name: "Emma Wilson", phone: "555-333-4444" },
  { id: "6", name: "Lisa Brown", phone: "555-444-5555" },
  { id: "7", name: "John Smith", phone: "555-666-7777" },
  { id: "8", name: "Maria Garcia", phone: "555-888-9999" },
  { id: "9", name: "Robert Taylor", phone: "555-111-2222" },
  { id: "10", name: "Jennifer Lee", phone: "555-333-2222" },
]

export default function HomePage() {
  const [appointments, setAppointments] = useState(SAMPLE_APPOINTMENTS)
  const [messages, setMessages] = useState(SAMPLE_MESSAGES)
  const [showNotification, setShowNotification] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<(typeof SAMPLE_MESSAGES)[0] | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  // Quick add form state
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; phone: string } | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)
  const [customDuration, setCustomDuration] = useState<string>("45")
  const [notes, setNotes] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [newCustomerName, setNewCustomerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Show notification for new messages
  useEffect(() => {
    const newMessages = messages.filter((msg) => msg.isNew)
    if (newMessages.length > 0) {
      setCurrentMessage(newMessages[0])
      setShowNotification(true)

      // Auto-hide notification after 8 seconds
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [messages])

  const handleDismissNotification = () => {
    setShowNotification(false)
    if (currentMessage) {
      setMessages(messages.map((msg) => (msg.id === currentMessage.id ? { ...msg, isNew: false } : msg)))
    }
  }

  const handleViewMessage = () => {
    setShowNotification(false)
    if (currentMessage) {
      setMessages(messages.map((msg) => (msg.id === currentMessage.id ? { ...msg, isNew: false } : msg)))
    }
    // Navigate to messages page
    window.location.href = "/messages"
  }

  // Get today's date in a readable format
  const formattedDate = format(currentDate, "EEEE, MMMM d")

  // Count new messages
  const newMessageCount = messages.filter((msg) => msg.isNew).length

  // Handle voice assistant
  const handleVoiceAssistant = () => {
    setIsListening(true)

    // Update UI text to show "Speaking now..."
    const speakingElement = document.getElementById("speaking-status")
    if (speakingElement) {
      speakingElement.textContent = "Speaking now..."
    }

    // Simulate voice recognition (in a real app, this would use the Web Speech API)
    setTimeout(() => {
      setIsListening(false)
      if (speakingElement) {
        speakingElement.textContent = "Press the microphone button to speak"
      }
      alert("Voice command recognized: 'Show me tomorrow's schedule'")

      // Move to next day
      const nextDay = new Date(currentDate)
      nextDay.setDate(currentDate.getDate() + 1)
      setCurrentDate(nextDay)
    }, 3000)
  }

  // Change date
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + days)
    setCurrentDate(newDate)
  }

  // Handle date selection for quick add
  const handleDateSelect = (daysToAdd: number) => {
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + daysToAdd)
    setSelectedDate(newDate)
  }

  // Filter customers based on search query
  const filteredCustomers = SAMPLE_CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phone.includes(searchQuery),
  )

  // Handle walk-in client selection
  const handleWalkInClient = () => {
    if (newCustomerName.trim()) {
      setSelectedCustomer({
        id: "walk-in-" + Date.now(),
        name: newCustomerName,
        phone: phoneNumber,
      })
    } else {
      setSelectedCustomer({
        id: "walk-in",
        name: "Walk-in Client",
        phone: phoneNumber,
      })
    }
  }

  // Clear selected customer
  const clearSelectedCustomer = () => {
    setSelectedCustomer(null)
    setPhoneNumber("")
  }

  // Get service name from ID
  const getServiceName = (serviceId: string | null) => {
    if (!serviceId) return ""
    const service = SERVICES.find((s) => s.id === serviceId)
    return service ? service.name : ""
  }

  // Handle quick add appointment
  const handleQuickAddSubmit = () => {
    if (!selectedService || !selectedTime || !selectedWorker || !selectedCustomer) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    const service = SERVICES.find((s) => s.id === selectedService)
    const worker = WORKERS.find((w) => w.id === selectedWorker)

    if (!service || !worker) {
      alert("Invalid selection")
      setIsSubmitting(false)
      return
    }

    // Convert duration to display format
    let durationDisplay = ""
    const durationMinutes = Number.parseInt(customDuration)
    if (durationMinutes < 60) {
      durationDisplay = `${durationMinutes} min`
    } else {
      const hours = Math.floor(durationMinutes / 60)
      const minutes = durationMinutes % 60
      durationDisplay = minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`
    }

    const newAppointment = {
      id: Date.now().toString(),
      customerName: selectedCustomer.name,
      service: service.name,
      time: selectedTime,
      duration: durationDisplay,
      phone: selectedCustomer.phone || phoneNumber,
      status: "confirmed",
      worker: worker.name,
    }

    // In a real app, this would save to a database
    setTimeout(() => {
      setAppointments([...appointments, newAppointment])
      setIsSubmitting(false)
      setShowQuickAdd(false)
      resetQuickAdd()

      // Show confirmation
      alert(`Appointment added: ${service.name} at ${selectedTime} with ${worker.name}`)
    }, 1000)
  }

  // Reset quick add form
  const resetQuickAdd = () => {
    setShowQuickAdd(false)
    setSelectedService(null)
    setSelectedTime(null)
    setSelectedWorker(null)
    setSelectedCustomer(null)
    setCustomDuration("45")
    setPhoneNumber("")
    setNotes("")
    setNewCustomerName("")
    setSearchQuery("")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white text-gray-800 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Nail Salon</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative h-12 w-12 rounded-full border-gray-200 hover:bg-secondary"
              onClick={() => (window.location.href = "/messages")}
            >
              <MessageSquare className="h-6 w-6 text-gray-600" />
              {newMessageCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                  {newMessageCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-gray-200 hover:bg-secondary"
              onClick={handleVoiceAssistant}
            >
              <Mic className={`h-6 w-6 text-gray-600 ${isListening ? "text-primary animate-pulse" : ""}`} />
            </Button>
            {isListening && (
              <p className="text-primary animate-pulse" id="speaking-status">
                Speaking now...
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Date navigation */}
      <div className="bg-secondary/30 p-4 flex justify-between items-center border-b border-gray-100">
        <Button
          variant="outline"
          size="lg"
          className="text-lg px-6 h-14 bg-white border-gray-200 hover:bg-secondary"
          onClick={() => changeDate(-1)}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Previous
        </Button>

        <h2 className="text-xl font-medium text-gray-800">{formattedDate}</h2>

        <Button
          variant="outline"
          size="lg"
          className="text-lg px-6 h-14 bg-white border-gray-200 hover:bg-secondary"
          onClick={() => changeDate(1)}
        >
          Next
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Main content - Today's appointments */}
      <main className="flex-1 p-4 pb-24 bg-white">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-medium text-gray-800">Appointments</h2>
          <Button
            size="lg"
            className="text-lg h-14 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowQuickAdd(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Quick Add
          </Button>
        </div>

        {showQuickAdd ? (
          <Card className="mb-6 shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-800">Quick Add Appointment</h3>
                <Button variant="ghost" size="sm" onClick={resetQuickAdd} className="text-gray-500">
                  Cancel
                </Button>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-4 text-gray-800">Select Date:</h2>
                <div className="flex flex-col space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className={`flex-1 text-lg py-4 justify-center bg-white border-gray-200 hover:bg-secondary ${
                        isSameDay(selectedDate, new Date()) ? "bg-secondary border-primary" : ""
                      }`}
                      onClick={() => handleDateSelect(0)}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      className={`flex-1 text-lg py-4 justify-center bg-white border-gray-200 hover:bg-secondary ${
                        isSameDay(selectedDate, new Date(new Date().setDate(new Date().getDate() + 1)))
                          ? "bg-secondary border-primary"
                          : ""
                      }`}
                      onClick={() => handleDateSelect(1)}
                    >
                      Tomorrow
                    </Button>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full text-lg py-4 justify-between bg-white border-gray-200 text-gray-700 hover:bg-secondary"
                      >
                        <span>{format(selectedDate, "MMMM d, yyyy")}</span>
                        <CalendarIcon className="h-5 w-5 opacity-70" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-md border"
                        numberOfMonths={1}
                        components={{
                          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                          IconRight: () => <ChevronRight className="h-4 w-4" />,
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                {/* Service Selection */}
                <div>
                  <h2 className="text-xl font-medium mb-2 text-gray-800">Service:</h2>
                  <Select value={selectedService || ""} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-full text-lg py-4 h-auto bg-white border-gray-200">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((service) => (
                        <SelectItem key={service.id} value={service.id} className="text-base py-2">
                          {service.name} ({service.duration})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Selection */}
                <div>
                  <h2 className="text-xl font-medium mb-2 text-gray-800">Duration:</h2>
                  <Select value={customDuration} onValueChange={setCustomDuration}>
                    <SelectTrigger className="w-full text-lg py-4 h-auto bg-white border-gray-200">
                      <SelectValue placeholder="Service duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15" className="text-base py-2">
                        15 minutes
                      </SelectItem>
                      <SelectItem value="30" className="text-base py-2">
                        30 minutes
                      </SelectItem>
                      <SelectItem value="45" className="text-base py-2">
                        45 minutes
                      </SelectItem>
                      <SelectItem value="60" className="text-base py-2">
                        1 hour
                      </SelectItem>
                      <SelectItem value="75" className="text-base py-2">
                        1 hour 15 minutes
                      </SelectItem>
                      <SelectItem value="90" className="text-base py-2">
                        1 hour 30 minutes
                      </SelectItem>
                      <SelectItem value="120" className="text-base py-2">
                        2 hours
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Selection */}
                <div>
                  <h2 className="text-xl font-medium mb-2 text-gray-800">Time:</h2>
                  <Select value={selectedTime || ""} onValueChange={setSelectedTime}>
                    <SelectTrigger className="w-full text-lg py-4 h-auto bg-white border-gray-200">
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time} className="text-base py-2">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Worker Selection */}
                <div>
                  <h2 className="text-xl font-medium mb-2 text-gray-800">Worker:</h2>
                  <RadioGroup
                    value={selectedWorker || ""}
                    onValueChange={setSelectedWorker}
                    className="grid grid-cols-2 gap-2"
                  >
                    {WORKERS.map((worker) => (
                      <div
                        key={worker.id}
                        className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-secondary bg-white"
                      >
                        <RadioGroupItem value={worker.id} id={`worker-${worker.id}`} className="h-4 w-4" />
                        <Label
                          htmlFor={`worker-${worker.id}`}
                          className="text-base font-medium cursor-pointer flex-1 text-gray-700"
                        >
                          {worker.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Customer Selection */}
                <div>
                  <h2 className="text-xl font-medium mb-2 text-gray-800">Customer:</h2>

                  {selectedCustomer ? (
                    <div className="bg-secondary rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{selectedCustomer.name}</p>
                        {selectedCustomer.phone && <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearSelectedCustomer} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Tabs defaultValue="search" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="search">Search Existing</TabsTrigger>
                        <TabsTrigger value="walkin">Walk-in Client</TabsTrigger>
                      </TabsList>

                      <TabsContent value="search" className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search by name or phone..."
                            className="pl-10 py-6 text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                          {filteredCustomers.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">No customers found</p>
                          ) : (
                            filteredCustomers.map((customer) => (
                              <Button
                                key={customer.id}
                                variant="outline"
                                className="w-full text-base py-3 justify-start bg-white border-gray-200 hover:bg-secondary"
                                onClick={() => {
                                  setSelectedCustomer(customer)
                                  setPhoneNumber(customer.phone)
                                }}
                              >
                                <span className="font-medium text-gray-800">{customer.name}</span>
                                {customer.phone && <span className="ml-2 text-gray-500">({customer.phone})</span>}
                              </Button>
                            ))
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="walkin" className="space-y-4">
                        <Input
                          placeholder="Enter client name (optional)"
                          className="py-6 text-base"
                          value={newCustomerName}
                          onChange={(e) => setNewCustomerName(e.target.value)}
                        />

                        <Input
                          type="tel"
                          placeholder="Enter phone number (optional)"
                          className="py-6 text-base"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />

                        <Button
                          className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={handleWalkInClient}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          {newCustomerName ? `Add ${newCustomerName} as Client` : "Add as Walk-in Client"}
                        </Button>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <h2 className="text-xl font-medium mb-2 text-gray-800">Additional Notes (Optional):</h2>
                  <Textarea
                    placeholder="Enter any special requests or notes about this appointment..."
                    className="min-h-[100px] text-base bg-white border-gray-200"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {selectedService && (
                  <div className="rounded-lg p-4 bg-secondary mt-4 border border-primary/20">
                    <h2 className="text-lg font-medium mb-2 text-gray-800">Service Details:</h2>
                    <p className="text-base mb-2 text-gray-600">
                      <span className="font-medium">Service:</span> {getServiceName(selectedService)}
                    </p>
                    <p className="text-base mb-2 text-gray-600">
                      <span className="font-medium">Standard Duration:</span>{" "}
                      {SERVICES.find((s) => s.id === selectedService)?.duration}
                    </p>
                    <p className="text-base text-gray-600">
                      <span className="font-medium">Description:</span>{" "}
                      {SERVICES.find((s) => s.id === selectedService)?.description}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full text-lg py-6 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleQuickAddSubmit}
                  disabled={isSubmitting || !selectedService || !selectedTime || !selectedWorker || !selectedCustomer}
                >
                  {isSubmitting ? "Creating..." : "Create Appointment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-250px)]">
            {appointments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xl text-gray-500">No appointments scheduled for today</p>
                <Button
                  className="mt-6 text-lg py-6 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                  onClick={() => setShowQuickAdd(true)}
                >
                  Add Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </main>

      {/* Simple bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center py-3 h-auto text-primary"
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
            className="flex flex-col items-center py-3 h-auto text-gray-500"
            onClick={() => (window.location.href = "/calendar")}
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
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span className="text-sm">Calendar</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-3 h-auto text-gray-500"
            onClick={() => (window.location.href = "/messages")}
          >
            <MessageSquare className="mb-1 h-6 w-6" />
            <span className="text-sm">Messages</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-3 h-auto text-gray-500"
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
        </div>
      </div>

      {/* Message notification */}
      {showNotification && currentMessage && (
        <MessageNotification
          message={currentMessage}
          onDismiss={handleDismissNotification}
          onView={handleViewMessage}
        />
      )}
    </div>
  )
}

// Appointment Card Component
function AppointmentCard({
  appointment,
}: {
  appointment: {
    id: string
    customerName: string
    service: string
    time: string
    duration: string
    phone: string
    status: string
    worker: string
  }
}) {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-100">
      <CardContent className="p-0">
        <div className="flex">
          <div
            className={`${
              appointment.status === "confirmed" ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-800"
            } p-4 w-24 flex flex-col items-center justify-center text-center`}
          >
            <div className="text-xl font-bold">{appointment.time}</div>
            <div className="text-sm">{appointment.duration}</div>
          </div>

          <div className="p-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl font-medium text-gray-800">{appointment.customerName}</div>
                <div className="text-lg text-gray-600">{appointment.service}</div>
                <div className="text-sm text-gray-500 mt-1">with {appointment.worker}</div>
              </div>
              <Badge
                className={`text-base px-3 py-1 ${
                  appointment.status === "confirmed"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
              </Badge>
            </div>

            {appointment.phone && (
              <div className="mt-3 flex items-center text-base text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {appointment.phone}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button
                className="flex-1 text-base py-2 bg-secondary hover:bg-secondary/80 text-gray-800"
                onClick={() => (window.location.href = `/edit-appointment/${appointment.id}`)}
              >
                Edit
              </Button>
              {appointment.phone ? (
                <Button
                  variant="outline"
                  className="flex-1 text-base py-2 border-gray-200 hover:bg-secondary/50"
                  onClick={() => (window.location.href = `/call/${appointment.phone}`)}
                >
                  Call
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 text-base py-2 border-gray-200 hover:bg-secondary/50"
                  onClick={() => alert("No phone number available")}
                >
                  Add Phone
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

