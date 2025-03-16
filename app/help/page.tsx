import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, Mic, MessageSquare, Calendar, User } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-3 h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Help & Instructions</h1>
      </div>

      <Card className="mb-6 border-2">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            How to Use This App
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-lg mb-4">
            This app is designed to make scheduling appointments for your nail salon as easy as possible. Here's how to
            use the main features:
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Managing Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-base mb-1">View Today's Schedule</h3>
            <p>The home screen shows all appointments for today. Use the arrows to see other days.</p>
          </div>
          <div>
            <h3 className="font-bold text-base mb-1">Add New Appointment</h3>
            <p>Tap "Add New" on the home screen to create a new appointment manually.</p>
          </div>
          <div>
            <h3 className="font-bold text-base mb-1">Edit or Cancel</h3>
            <p>Tap "Edit" on any appointment card to make changes or cancel it.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Text Message Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-base mb-1">Automatic Notifications</h3>
            <p>When customers text you, you'll see a notification with their message.</p>
          </div>
          <div>
            <h3 className="font-bold text-base mb-1">Create Appointments from Texts</h3>
            <p>
              The app can automatically detect appointment requests in text messages and create appointments for you.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-base mb-1">Text Message Parser</h3>
            <p>Go to "Messages" and select a conversation to see booking options.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-base mb-1">Using Voice Commands</h3>
            <p>Tap the microphone button at the top of the screen and speak your request.</p>
          </div>
          <div>
            <h3 className="font-bold text-base mb-1">Example Commands</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>"Show me tomorrow's schedule"</li>
              <li>"Book an appointment for Sarah at 2pm"</li>
              <li>"What appointments do I have on Friday?"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Customer Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-base mb-1">Finding Customers</h3>
            <p>Tap "Customers" in the bottom menu to see all your customers.</p>
          </div>
          <div>
            <h3 className="font-bold text-base mb-1">Quick Booking for Existing Customers</h3>
            <p>When adding an appointment, tap "Find Existing Customer" to quickly select someone.</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8 mb-16">
        <p className="text-lg mb-4">Need more help?</p>
        <Button size="lg" className="text-lg py-6 px-8">
          Call Support
        </Button>
      </div>
    </div>
  )
}

