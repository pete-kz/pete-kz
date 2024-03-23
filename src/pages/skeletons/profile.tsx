import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function ProfileSkeleton() {
	return (
		<div className="h-screen w-full flex-col flex gap-2 p-4">
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
			<div className="w-full flex flex-col gap-2">
				<Skeleton className="h-16 w-full" />
				<Skeleton className="h-16 w-full" />
				<Skeleton className="h-16 w-full" />
				<Skeleton className="h-16 w-full" />
			</div>
		</div>
	)
}
