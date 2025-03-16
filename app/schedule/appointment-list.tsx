"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"

// Sample appointment data - in a real app, this would come from a database
const SAMPLE_APPOINTMENTS = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    service: "Gel Manicure",
    time: "10:00 AM",
    duration: "45 min",
    phone: "555-123-4567",
  },
  {
    id: "2",
    customerName: "Michael Chen",
    service: "Pedicure",
    time: "11:30 AM",
    duration: "60 min",
    phone: "555-987-6543",
  },
  {
    id: "3",
    customerName: "Jessica Williams",
    service: "Full Set Acrylic",
    time: "1:15 PM",
    duration: "90 min",
    phone: "555-456-7890",
  },
]

export function AppointmentList() {
  const [appointments, setAppointments] = useState(SAMPLE_APPOINTMENTS)

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(appointments.filter((appointment) => appointment.id !== id))
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No appointments scheduled</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="bg-primary p-4 text-primary-foreground sm:w-32 flex items-center justify-center text-center">
                <div>
                  <div className="text-xl font-bold">{appointment.time}</div>
                  <div className="text-sm">{appointment.duration}</div>
                </div>
              </div>

              <div className="p-4 flex-1">
                <div className="font-bold text-lg">{appointment.customerName}</div>
                <div className="text-muted-foreground">{appointment.service}</div>
                <div className="text-sm mt-1">{appointment.phone}</div>
              </div>

              <div className="flex sm:flex-col justify-end p-4 gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(appointment.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

