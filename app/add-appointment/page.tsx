"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Check, Search } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  customerName: z.string().min(2, { message: "Name is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  service: z.string().min(1, { message: "Please select a service" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
})

const services = [
  "Regular Manicure",
  "Gel Manicure",
  "Regular Pedicure",
  "Gel Pedicure",
  "Full Set Acrylic",
  "Nail Art",
  "Polish Change",
  "Manicure & Pedicure Combo",
]

const timeSlots = [
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
]

// Sample customer data for quick selection
const SAMPLE_CUSTOMERS = [
  { id: "1", name: "Sarah Johnson", phone: "555-123-4567" },
  { id: "2", name: "Michael Chen", phone: "555-987-6543" },
  { id: "3", name: "Jessica Williams", phone: "555-456-7890" },
  { id: "4", name: "David Rodriguez", phone: "555-222-3333" },
]

export default function AddAppointmentPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [searchCustomer, setSearchCustomer] = useState("")
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      service: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // In a real app, this would save to a database
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      form.reset()
    }, 3000)
  }

  const handleSelectCustomer = (customer: (typeof SAMPLE_CUSTOMERS)[0]) => {
    form.setValue("customerName", customer.name)
    form.setValue("phone", customer.phone)
    setShowCustomerSearch(false)
    setSearchCustomer("")
  }

  // Filter customers based on search
  const filteredCustomers = SAMPLE_CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchCustomer.toLowerCase()) || customer.phone.includes(searchCustomer),
  )

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-3 h-10 w-10" onClick={() => (window.location.href = "/")}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Add Appointment</h1>
        </div>

        <Card className="p-6 text-center bg-primary/10 border-2 border-primary">
          <Check className="mx-auto h-16 w-16 text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-3">Appointment Scheduled!</h3>
          <p className="text-lg mb-6">The appointment has been successfully added to the calendar.</p>
          <div className="flex gap-4 flex-col">
            <Button onClick={() => setIsSubmitted(false)} className="text-lg py-6" size="lg">
              Add Another Appointment
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
        <h1 className="text-2xl font-bold">Add Appointment</h1>
      </div>

      <Button
        variant="outline"
        className="w-full text-lg py-6 mb-6 justify-start"
        size="lg"
        onClick={() => setShowCustomerSearch(true)}
      >
        <Search className="mr-2 h-5 w-5" />
        Find Existing Customer
      </Button>

      {showCustomerSearch && (
        <Card className="mb-6 border-2">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-3">Select Customer</h3>
            <Input
              placeholder="Search by name or phone..."
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="mb-4 text-base py-6"
            />

            <div className="space-y-2">
              {filteredCustomers.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No customers found</p>
              ) : (
                filteredCustomers.map((customer) => (
                  <Button
                    key={customer.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div>
                      <div className="font-bold">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    </div>
                  </Button>
                ))
              )}
            </div>

            <Button variant="ghost" className="w-full mt-4" onClick={() => setShowCustomerSearch(false)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer name" {...field} className="text-lg py-6" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} className="text-lg py-6" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Service</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-lg py-6">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service} className="text-base py-3">
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Date</FormLabel>
                <Card>
                  <CardContent className="p-3">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      className="mx-auto"
                    />
                  </CardContent>
                </Card>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-lg py-6">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time} className="text-base py-3">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full text-lg py-6 mt-8" size="lg">
            Schedule Appointment
          </Button>
        </form>
      </Form>
    </div>
  )
}

