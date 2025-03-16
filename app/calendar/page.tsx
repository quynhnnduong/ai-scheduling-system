"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns"

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
    date: new Date(2025, 2, 12), // March 12, 2025
  },
  {
    id: "2",
    customerName: "Michael Chen",
    service: "Pedicure",
    time: "11:30 AM",
    duration: "60 min",
    phone: "555-987-6543",
    status: "confirmed",
    date: new Date(2025, 2, 12), // March 12, 2025
  },
  {
    id: "3",
    customerName: "Jessica Williams",
    service: "Full Set Acrylic",
    time: "1:15 PM",
    duration: "90 min",
    phone: "555-456-7890",
    status: "confirmed",
    date: new Date(2025, 2, 15), // March 15, 2025
  },
  {
    id: "4",
    customerName: "David Rodriguez",
    service: "Pedicure",
    time: "3:00 PM",
    duration: "60 min",
    phone: "555-222-3333",
    status: "pending",
    date: new Date(2025, 2, 18), // March 18, 2025
  },
  {
    id: "5",
    customerName: "Emma Wilson",
    service: "Gel Pedicure",
    time: "2:00 PM",
    duration: "75 min",
    phone: "555-333-4444",
    status: "confirmed",
    date: new Date(2025, 2, 20), // March 20, 2025
  },
  {
    id: "6",
    customerName: "Lisa Brown",
    service: "Nail Art",
    time: "4:30 PM",
    duration: "60 min",
    phone: "555-555-6666",
    status: "confirmed",
    date: new Date(2025, 2, 22), // March 22, 2025
  },
  {
    id: "7",
    customerName: "John Smith",
    service: "Regular Manicure",
    time: "9:30 AM",
    duration: "30 min",
    phone: "555-777-8888",
    status: "confirmed",
    date: new Date(2025, 2, 25), // March 25, 2025
  },
]

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState(SAMPLE_APPOINTMENTS)
  const [viewMode, setViewMode] = useState<"month" | "day">("month")
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  // Get days in current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart)

  // Create blank spaces for days before the first of the month
  const blanks = Array(startDay).fill(null)

  // Combine blanks and days to create the calendar grid
  const calendarDays = [...blanks, ...monthDays]

  // Get appointments for selected date
  const selectedDateAppointments = appointments.filter((appointment) => isSameDay(appointment.date, selectedDate))

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Handle day selection
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setViewMode("day")
  }

  // Get appointment count for a specific day
  const getAppointmentCount = (date: Date) => {
    return appointments.filter((appointment) => isSameDay(appointment.date, date)).length
  }

  // Format the selected date
  const formattedSelectedDate = format(selectedDate, "EEEE, MMMM d, yyyy")

  // Handle quick add appointment
  const handleQuickAdd = (time: string, service: string) => {
    const newAppointment = {
      id: Date.now().toString(),
      customerName: "Walk-in Client",
      service: service,
      time: time,
      duration: service.includes("Pedicure") ? "60 min" : "45 min",
      phone: "",
      status: "confirmed",
      date: selectedDate,
    }

    setAppointments([...appointments, newAppointment])
    setShowQuickAdd(false)

    // Show confirmation
    alert(`Appointment added: ${service} at ${time}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground p-4">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="secondary" size="icon" className="mr-3 h-12 w-12 rounded-full">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <div className="ml-auto">
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => (viewMode === "day" ? setShowQuickAdd(true) : (window.location.href = "/quick-add"))}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-24">
        {viewMode === "month" ? (
          // Month view
          <>
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" size="lg" className="text-lg px-4 h-14 bg-white" onClick={prevMonth}>
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>

              <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>

              <Button variant="outline" size="lg" className="text-lg px-4 h-14 bg-white" onClick={nextMonth}>
                Next
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-4 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-bold py-2 text-lg bg-accent rounded-md">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) {
                  // Render empty cell for days before the start of the month
                  return <div key={`empty-${index}`} className="h-20 bg-muted/30 rounded-md"></div>
                }

                const appointmentCount = getAppointmentCount(day)
                const isToday = isSameDay(day, new Date())
                const isSelected = isSameDay(day, selectedDate)

                return (
                  <Button
                    key={day.toString()}
                    variant="outline"
                    className={`h-20 flex flex-col items-center justify-start p-1 ${
                      !isSameMonth(day, currentMonth) ? "opacity-40" : ""
                    } ${isToday ? "border-primary border-2" : ""} ${isSelected ? "bg-accent" : "bg-white"}`}
                    onClick={() => handleSelectDate(day)}
                  >
                    <span className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>{format(day, "d")}</span>

                    {appointmentCount > 0 && (
                      <Badge className={`mt-1 px-2 py-1 ${appointmentCount > 3 ? "bg-pending" : "bg-confirmed"}`}>
                        {appointmentCount} {appointmentCount === 1 ? "appt" : "appts"}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>

            {/* Quick actions */}
            <div className="mt-6 flex gap-3">
              <Button
                className="flex-1 text-lg py-6"
                onClick={() => {
                  setSelectedDate(new Date())
                  setViewMode("day")
                }}
              >
                View Today
              </Button>
              <Link href="/quick-add" className="flex-1">
                <Button variant="secondary" className="w-full text-lg py-6">
                  Quick Add
                </Button>
              </Link>
            </div>
          </>
        ) : (
          // Day view
          <>
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="lg"
                className="text-lg h-14 bg-white"
                onClick={() => setViewMode("month")}
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back to Month
              </Button>

              <h2 className="text-xl font-bold">{format(selectedDate, "MMM d")}</h2>

              <Button variant="secondary" size="lg" className="text-lg h-14" onClick={() => setShowQuickAdd(true)}>
                Quick Add
              </Button>
            </div>

            <h3 className="text-2xl font-bold mb-4">{formattedSelectedDate}</h3>

            {showQuickAdd ? (
              <Card className="mb-6 border-2 border-primary">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-4">Quick Add Appointment</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-bold mb-2">Select Time:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "9:00 AM",
                          "10:00 AM",
                          "11:00 AM",
                          "12:00 PM",
                          "1:00 PM",
                          "2:00 PM",
                          "3:00 PM",
                          "4:00 PM",
                          "5:00 PM",
                        ].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            className="text-base py-6 bg-white"
                            onClick={() => handleQuickAdd(time, "Gel Manicure")}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold mb-2">Common Services:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="text-base py-6 bg-white"
                          onClick={() => handleQuickAdd("2:00 PM", "Gel Manicure")}
                        >
                          Gel Manicure
                        </Button>
                        <Button
                          variant="outline"
                          className="text-base py-6 bg-white"
                          onClick={() => handleQuickAdd("2:00 PM", "Regular Manicure")}
                        >
                          Regular Manicure
                        </Button>
                        <Button
                          variant="outline"
                          className="text-base py-6 bg-white"
                          onClick={() => handleQuickAdd("2:00 PM", "Pedicure")}
                        >
                          Pedicure
                        </Button>
                        <Button
                          variant="outline"
                          className="text-base py-6 bg-white"
                          onClick={() => handleQuickAdd("2:00 PM", "Gel Pedicure")}
                        >
                          Gel Pedicure
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full text-base py-6" onClick={() => setShowQuickAdd(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[calc(100vh-250px)]">
                {selectedDateAppointments.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-xl">No appointments scheduled for this date</p>
                    <Button className="mt-6 text-lg py-6 px-8" size="lg" onClick={() => setShowQuickAdd(true)}>
                      Add Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateAppointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}
          </>
        )}
      </main>

      {/* Mobile navigation */}
      <MobileNav />
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
  }
}) {
  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-0">
        <div className="flex">
          <div
            className={`${appointment.status === "confirmed" ? "bg-confirmed" : "bg-pending"} p-4 w-24 flex flex-col items-center justify-center text-center text-white`}
          >
            <div className="text-xl font-bold">{appointment.time}</div>
            <div className="text-sm">{appointment.duration}</div>
          </div>

          <div className="p-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl font-bold">{appointment.customerName}</div>
                <div className="text-lg">{appointment.service}</div>
              </div>
              <Badge
                className={`text-base px-3 py-1 ${appointment.status === "confirmed" ? "bg-confirmed text-white" : "bg-pending"}`}
              >
                {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
              </Badge>
            </div>

            {appointment.phone && (
              <div className="mt-3 flex items-center text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                {appointment.phone}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button
                className="flex-1 text-base py-2"
                onClick={() => (window.location.href = `/edit-appointment/${appointment.id}`)}
              >
                Edit
              </Button>
              {appointment.phone ? (
                <Button
                  variant="outline"
                  className="flex-1 text-base py-2"
                  onClick={() => (window.location.href = `/call/${appointment.phone}`)}
                >
                  Call
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 text-base py-2"
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

