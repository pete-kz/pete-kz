import { useState, useEffect } from "react"

const getIsMobile = () => window.innerWidth <= 768
const getDisplay = () => (window.innerWidth / window.innerHeight > 1 ? "landscape" : "portrait")

export default function useIsMobile() {
	const [isMobile, setIsMobile] = useState(getIsMobile())
	const [display, setDisplay] = useState(getDisplay())

	useEffect(() => {
		const onResize = () => {
			setIsMobile(getIsMobile())
			setDisplay(getDisplay())
		}

		window.addEventListener("resize", onResize)

		return () => {
			window.removeEventListener("resize", onResize)
		}
	}, [])

	return {
		isMobile,
		display,
	}
}
