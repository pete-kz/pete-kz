import React from "react"
import LoadingSpinner from "./loading-spinner"

export default function LoadingPage() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<LoadingSpinner size={24} />
		</div>
	)
}
