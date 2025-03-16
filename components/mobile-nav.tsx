"use client"

import { Calendar, Home, MessageSquare, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <div className="grid grid-cols-4 h-16">
        <Link href="/" className="flex flex-col items-center justify-center">
          <div
            className={`flex flex-col items-center justify-center ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
          >
            <Home className="h-6 w-6" />
            <span className="text-sm mt-1">Home</span>
          </div>
        </Link>

        <Link href="/calendar" className="flex flex-col items-center justify-center">
          <div
            className={`flex flex-col items-center justify-center ${isActive("/calendar") ? "text-primary" : "text-muted-foreground"}`}
          >
            <Calendar className="h-6 w-6" />
            <span className="text-sm mt-1">Calendar</span>
          </div>
        </Link>

        <Link href="/messages" className="flex flex-col items-center justify-center">
          <div
            className={`flex flex-col items-center justify-center ${isActive("/messages") ? "text-primary" : "text-muted-foreground"}`}
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-sm mt-1">Messages</span>
          </div>
        </Link>

        <Link href="/customers" className="flex flex-col items-center justify-center">
          <div
            className={`flex flex-col items-center justify-center ${isActive("/customers") ? "text-primary" : "text-muted-foreground"}`}
          >
            <User className="h-6 w-6" />
            <span className="text-sm mt-1">Customers</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

