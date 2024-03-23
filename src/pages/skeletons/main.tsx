import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function MainSkeleton() {
	return (
		<div className="flex h-screen w-full items-center justify-center p-4">
			<Skeleton className="h-[477px] w-full" />
		</div>
	)
}
