"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Search, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample customer data - in a real app, this would come from a database
const SAMPLE_CUSTOMERS = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "555-123-4567",
    email: "sarah.j@example.com",
    preferredServices: "Gel Manicure, Pedicure",
    lastVisit: "2023-11-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    phone: "555-987-6543",
    email: "mchen@example.com",
    preferredServices: "Regular Manicure",
    lastVisit: "2023-11-02",
  },
  {
    id: "3",
    name: "Jessica Williams",
    phone: "555-456-7890",
    email: "jwilliams@example.com",
    preferredServices: "Full Set Acrylic, Nail Art",
    lastVisit: "2023-10-28",
  },
  {
    id: "4",
    name: "David Rodriguez",
    phone: "555-222-3333",
    email: "drodriguez@example.com",
    preferredServices: "Pedicure",
    lastVisit: "2023-11-10",
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Customers</h1>
          <div className="ml-auto">
            <Link href="/add-customer">
              <Button size="icon" variant="outline">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-20">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No customers found</p>
              <Link href="/add-customer">
                <Button className="mt-4">Add Customer</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="bg-primary/10 p-4 w-14 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>

                      <div className="p-3 flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-bold">{customer.name}</div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                >
                                  <path
                                    d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link href={`/add-appointment?customer=${customer.id}`} className="w-full">
                                  Book Appointment
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                              <DropdownMenuItem>View History</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="text-sm text-muted-foreground mt-1">
                          <div>{customer.phone}</div>
                          {customer.email && <div>{customer.email}</div>}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Last visit: {new Date(customer.lastVisit).toLocaleDateString()}
                          </div>
                          {customer.preferredServices.split(",").map((service, index) => (
                            <div key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                              {service.trim()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </main>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}

