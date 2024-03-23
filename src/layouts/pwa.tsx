import React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"

export default function PwaLayout() {
	return (
		<>
			<Toaster />
			<div className='flex items-center justify-center bg-[url("/images/background.webp")] object-cover'>
				<main className="relative h-screen w-full max-w-lg bg-background">
					<Outlet />
				</main>
			</div>
		</>
	)
}
