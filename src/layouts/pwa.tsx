import React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import MobilePageHeader from "@/components/mobile-page-header"
import { NavProvider } from "@/lib/contexts"
import { useLocation } from "react-router-dom"

export default function PwaLayout() {
	const location = useLocation()

	function determineHref(): string | null {
		if (location.pathname.includes("/pwa/users") || location.pathname === "/pwa/profile") {
			return "/pwa"
		} else if (location.pathname === "/pwa") {
			return null
		} else {
			return "/pwa/profile"
		}
	}

	return (
		<NavProvider>
			<Toaster />
			{determineHref() && <MobilePageHeader href={determineHref()!} />}
			<motion.div className='flex items-center justify-center bg-[url("/images/background.webp")] object-cover' animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
				<main className={`relative ${location.pathname !== "/pwa" ? "h-[calc(100vh-4rem)]" : "h-screen"} w-full max-w-lg bg-background`}>
					<AnimatePresence mode="wait">
						<Outlet />
					</AnimatePresence>
				</main>
			</motion.div>
		</NavProvider>
	)
}
