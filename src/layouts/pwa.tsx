import React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"

export default function PwaLayout() {
	return (
		<>
			<Toaster />
			<div className='flex items-center bg-[url("/images/background.webp")] justify-center object-cover'>
				<main className="h-screen max-w-lg w-full relative bg-background">
					<Outlet />
				</main>
			</div>
		</>
	)
}
