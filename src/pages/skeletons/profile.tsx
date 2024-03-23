import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function ProfileSkeleton() {
	return (
		<div className="flex h-screen w-full flex-col gap-2 p-4">
			<Skeleton className="h-16 w-full" />
			<Skeleton className="h-16 w-full" />
			<p>...</p>
			<div className="grid grid-cols-3 grid-rows-2 gap-2">
				<Skeleton className="h-[86px] w-full" />
				<Skeleton className="h-[86px] w-full" />
				<Skeleton className="h-[86px] w-full" />
				<Skeleton className="h-[86px] w-full" />
				<Skeleton className="h-[86px] w-full" />
			</div>
			<p>...</p>
			<div className="flex w-full flex-col gap-2">
				<Skeleton className="h-16 w-full" />
				<Skeleton className="h-16 w-full" />
				<Skeleton className="h-16 w-full" />
				<Skeleton className="h-16 w-full" />
			</div>
		</div>
	)
}
