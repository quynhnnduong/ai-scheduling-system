import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Phone, Edit, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AppointmentCardProps {
  appointment: {
    id: string
    customerName: string
    service: string
    time: string
    duration: string
    phone: string
    status: string
  }
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="bg-primary p-3 text-primary-foreground w-20 flex flex-col items-center justify-center text-center">
            <div className="text-lg font-bold">{appointment.time}</div>
            <div className="text-xs">{appointment.duration}</div>
          </div>

          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">{appointment.customerName}</div>
                <div className="text-sm text-muted-foreground">{appointment.service}</div>
              </div>
              <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {appointment.duration}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Phone className="h-3 w-3 mr-1" />
                {appointment.phone}
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                  <DropdownMenuItem>Reschedule</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

