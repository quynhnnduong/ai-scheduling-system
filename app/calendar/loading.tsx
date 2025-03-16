import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-10 rounded-md mr-3" />
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array(7)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-8" />
          ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(35)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-md" />
          ))}
      </div>
    </div>
  )
}

