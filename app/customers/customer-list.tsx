"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, User } from "lucide-react"
import { useState } from "react"

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

export function CustomerList() {
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS)

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((customer) => customer.id !== id))
    }
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No customers found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="bg-primary/10 p-4 sm:w-16 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>

              <div className="p-4 flex-1">
                <div className="font-bold text-lg">{customer.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <div>{customer.phone}</div>
                  <div>{customer.email}</div>
                  <div className="mt-2">
                    <span className="font-medium">Preferred:</span> {customer.preferredServices}
                  </div>
                  <div>
                    <span className="font-medium">Last Visit:</span> {new Date(customer.lastVisit).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col justify-end p-4 gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)}>
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

