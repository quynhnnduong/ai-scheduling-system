import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormDescription, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
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
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salon Information</CardTitle>
              <CardDescription>Update your salon details and business hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormLabel>Salon Name</FormLabel>
                  <Input defaultValue="Elegant Nails & Spa" />
                </div>

                <div className="grid gap-3">
                  <FormLabel>Phone Number</FormLabel>
                  <Input defaultValue="555-123-4567" />
                </div>

                <div className="grid gap-3">
                  <FormLabel>Address</FormLabel>
                  <Input defaultValue="123 Main Street, Anytown, USA" />
                </div>

                <div className="grid gap-3">
                  <FormLabel>Business Hours</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Monday - Friday</p>
                      <Input defaultValue="9:00 AM - 6:00 PM" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Saturday</p>
                      <Input defaultValue="9:00 AM - 5:00 PM" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Sunday</p>
                      <Input defaultValue="Closed" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Appointment Reminders</FormLabel>
                    <FormDescription>Send SMS reminders to customers before appointments</FormDescription>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>New Booking Alerts</FormLabel>
                    <FormDescription>Receive notifications when new appointments are booked</FormDescription>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Cancellation Notifications</FormLabel>
                    <FormDescription>Receive alerts when appointments are cancelled</FormDescription>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="mt-6">
                  <FormLabel>Reminder Time</FormLabel>
                  <FormDescription className="mb-2">
                    How long before the appointment should reminders be sent
                  </FormDescription>
                  <Select defaultValue="24">
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour before</SelectItem>
                      <SelectItem value="2">2 hours before</SelectItem>
                      <SelectItem value="24">24 hours before</SelectItem>
                      <SelectItem value="48">48 hours before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant Settings</CardTitle>
              <CardDescription>Configure how the voice assistant works</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Voice Assistant Enabled</FormLabel>
                    <FormDescription>Enable or disable the voice assistant feature</FormDescription>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Voice Responses</FormLabel>
                    <FormDescription>Enable spoken responses from the assistant</FormDescription>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="mt-6">
                  <FormLabel>Assistant Voice</FormLabel>
                  <FormDescription className="mb-2">Choose the voice for the assistant</FormDescription>
                  <Select defaultValue="female">
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

