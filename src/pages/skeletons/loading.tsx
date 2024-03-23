import React from "react"
import LoadingSpinner from "@/components/loading-spinner"

export default function LoadingSkeleton() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<LoadingSpinner />
		</div>
	)
}
