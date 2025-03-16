import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface VoiceTranscriptProps {
  messages: {
    role: string
    content: string
  }[]
}

export function VoiceTranscript({ messages }: VoiceTranscriptProps) {
  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
              message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            {message.content}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

