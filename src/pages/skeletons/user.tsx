import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function UserSkeleton() {
  return (
    <div className="h-screen w-full flex items-center justify-center p-4">
      <Skeleton className="h-[140px] w-full" />
      <div className="grid grid-cols-3 grid-rows-2 gap-2">
        <Skeleton className="h-[86px] w-full" />
        <Skeleton className="h-[86px] w-full" />
        <Skeleton className="h-[86px] w-full" />
        <Skeleton className="h-[86px] w-full" />
        <Skeleton className="h-[86px] w-full" />
      </div>
    </div>
  )
}
