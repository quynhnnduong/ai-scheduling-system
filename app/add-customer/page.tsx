"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  email: z.string().email({ message: "Valid email is required" }).optional().or(z.literal("")),
  preferredServices: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

const serviceOptions = [
  { id: "regular-manicure", label: "Regular Manicure" },
  { id: "gel-manicure", label: "Gel Manicure" },
  { id: "regular-pedicure", label: "Regular Pedicure" },
  { id: "gel-pedicure", label: "Gel Pedicure" },
  { id: "full-set-acrylic", label: "Full Set Acrylic" },
  { id: "nail-art", label: "Nail Art" },
  { id: "polish-change", label: "Polish Change" },
  { id: "mani-pedi-combo", label: "Manicure & Pedicure Combo" },
]

export default function AddCustomerPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      preferredServices: [],
      notes: "",
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center mb-6">
          <Link href="/customers">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Add Customer</h1>
        </div>

        <Card className="p-6 text-center bg-primary/10">
          <Check className="mx-auto h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Customer Added!</h3>
          <p className="mb-4">The customer has been successfully added to the database.</p>
          <div className="flex gap-3">
            <Button onClick={() => setIsSubmitted(false)} className="flex-1">
              Add Another
            </Button>
            <Link href="/customers" className="flex-1">
              <Button variant="outline" className="w-full">
                View Customers
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/customers">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Add Customer</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredServices"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel>Preferred Services</FormLabel>
                  <FormDescription>Select the services this customer typically requests</FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {serviceOptions.map((service) => (
                    <FormField
                      key={service.id}
                      control={form.control}
                      name="preferredServices"
                      render={({ field }) => {
                        return (
                          <FormItem key={service.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), service.id])
                                    : field.onChange(field.value?.filter((value) => value !== service.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">{service.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes about this customer"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-6">
            Add Customer
          </Button>
        </form>
      </Form>
    </div>
  )
}

