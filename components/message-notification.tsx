"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

interface MessageNotificationProps {
  message: {
    id: string
    from: string
    content: string
    timestamp: Date
  }
  onDismiss: () => void
  onView: () => void
}

export function MessageNotification({ message, onDismiss, onView }: MessageNotificationProps) {
  return (
    <div className="fixed top-20 right-4 left-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
      <Card className="border-gray-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-lg text-gray-800">{message.from}</div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500" onClick={onDismiss}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-base mb-3 text-gray-600">{message.content}</p>
          <div className="flex justify-end gap-2">
            <Button
              size="lg"
              variant="outline"
              className="text-base border-gray-200 hover:bg-secondary"
              onClick={onDismiss}
            >
              Later
            </Button>
            <Button
              size="lg"
              className="text-base bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={onView}
            >
              View Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

