import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function MainSkeleton() {
  return (
    <div className="h-screen w-full flex items-center justify-center p-4">
      <Skeleton className="h-[477px] w-full" />
    </div>
  )
}
