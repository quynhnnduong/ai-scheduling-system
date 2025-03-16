"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CalendarIcon, ChevronLeft, ChevronRight, Search, Trash2, UserPlus, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { format, isSameDay } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams, useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

// Sample appointment data - in a real app, this would come from a database
const SAMPLE_APPOINTMENTS = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    service: "Gel Manicure",
    serviceId: "gel-manicure",
    time: "10:00 AM",
    duration: "45 min",
    durationMinutes: "45",
    phone: "555-123-4567",
    status: "confirmed",
    worker: "Helen",
    workerId: "helen",
    date: new Date(),
    notes: "Client prefers light pink colors",
  },
  {
    id: "2",
    customerName: "Michael Chen",
    service: "Pedicure",
    serviceId: "pedicure",
    time: "11:30 AM",
    duration: "60 min",
    durationMinutes: "60",
    phone: "555-987-6543",
    status: "confirmed",
    worker: "Daniel",
    workerId: "daniel",
    date: new Date(),
    notes: "",
  },
  {
    id: "3",
    customerName: "Jessica Williams",
    service: "Full Set Acrylic",
    serviceId: "full-set-acrylic",
    time: "1:15 PM",
    duration: "90 min",
    durationMinutes: "90",
    phone: "555-456-7890",
    status: "confirmed",
    worker: "Trinh",
    workerId: "trinh",
    date: new Date(),
    notes: "Wants square shape nails",
  },
  {
    id: "4",
    customerName: "David Rodriguez",
    service: "Pedicure",
    serviceId: "pedicure",
    time: "3:00 PM",
    duration: "60 min",
    durationMinutes: "60",
    phone: "555-222-3333",
    status: "pending",
    worker: "Helen",
    workerId: "helen",
    date: new Date(),
    notes: "",
  },
]

export default function EditAppointmentPage() {
  const params = useParams()
  const router = useRouter()
  const appointmentId = params.id as string

  const [appointment, setAppointment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; phone: string } | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<string>("")
  const [customDuration, setCustomDuration] = useState<string>("45")
  const [notes, setNotes] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [newCustomerName, setNewCustomerName] = useState("")
  const [status, setStatus] = useState<string>("confirmed")

  // Fetch appointment data
  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchedAppointment = SAMPLE_APPOINTMENTS.find((a) => a.id === appointmentId)

    if (fetchedAppointment) {
      setAppointment(fetchedAppointment)
      setSelectedDate(fetchedAppointment.date)
      setSelectedService(fetchedAppointment.serviceId)
      setSelectedTime(fetchedAppointment.time)
      setSelectedCustomer({
        id: fetchedAppointment.id,
        name: fetchedAppointment.customerName,
        phone: fetchedAppointment.phone,
      })
      setSelectedWorker(fetchedAppointment.workerId)
      setCustomDuration(fetchedAppointment.durationMinutes)
      setNotes(fetchedAppointment.notes)
      setPhoneNumber(fetchedAppointment.phone)
      setStatus(fetchedAppointment.status)
    }

    setIsLoading(false)
  }, [appointmentId])

  // Filter customers based on search query
  const filteredCustomers = SAMPLE_CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phone.includes(searchQuery),
  )

  // Handle date selection
  const handleDateSelect = (daysToAdd: number) => {
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + daysToAdd)
    setSelectedDate(newDate)
  }

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

  // Handle update appointment
  const handleUpdateAppointment = () => {
    if (!selectedService || !selectedTime || !selectedWorker || !selectedCustomer) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // In a real app, this would update the database
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Appointment updated successfully!")
      router.push("/")
    }, 1000)
  }

  // Handle delete appointment
  const handleDeleteAppointment = () => {
    setIsSubmitting(true)

    // In a real app, this would delete from the database
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Appointment deleted successfully!")
      router.push("/")
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <p className="text-xl">Loading appointment details...</p>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-3 h-12 w-12 rounded-full text-gray-600">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-medium text-gray-800">Appointment Not Found</h1>
        </div>
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-6 text-center">
            <p className="text-xl mb-4">The appointment you're looking for doesn't exist or has been deleted.</p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 pb-24">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-3 h-12 w-12 rounded-full text-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-medium text-gray-800">Edit Appointment</h1>
        <div className="ml-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this appointment. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDeleteAppointment}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-6">
          <div>
            <h2 className="text-xl font-medium mb-4 text-gray-800">Appointment Date:</h2>
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
            {/* Status Selection */}
            <div>
              <h2 className="text-xl font-medium mb-2 text-gray-800">Status:</h2>
              <RadioGroup value={status} onValueChange={setStatus} className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-secondary bg-white">
                  <RadioGroupItem value="confirmed" id="status-confirmed" className="h-4 w-4" />
                  <Label
                    htmlFor="status-confirmed"
                    className="text-base font-medium cursor-pointer flex-1 text-gray-700"
                  >
                    Confirmed
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-secondary bg-white">
                  <RadioGroupItem value="pending" id="status-pending" className="h-4 w-4" />
                  <Label htmlFor="status-pending" className="text-base font-medium cursor-pointer flex-1 text-gray-700">
                    Pending
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Service Selection */}
            <div>
              <h2 className="text-xl font-medium mb-2 text-gray-800">Service:</h2>
              <Select value={selectedService} onValueChange={setSelectedService}>
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
              <Select value={selectedTime} onValueChange={setSelectedTime}>
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
              <RadioGroup value={selectedWorker} onValueChange={setSelectedWorker} className="grid grid-cols-2 gap-2">
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

            <div className="flex gap-4 mt-6">
              <Button
                className="flex-1 text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleUpdateAppointment}
                disabled={isSubmitting || !selectedService || !selectedTime || !selectedWorker || !selectedCustomer}
              >
                {isSubmitting ? "Updating..." : "Update Appointment"}
              </Button>

              <Button
                variant="outline"
                className="flex-1 text-lg py-6 border-gray-200 hover:bg-secondary"
                onClick={() => router.push("/")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

