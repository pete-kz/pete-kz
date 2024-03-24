import { useState, useEffect } from "react"

const getIsMobile = () => window.innerWidth <= 768
const getDisplay = () => (window.innerWidth / window.innerHeight > 1 ? "landscape" : "portrait")

export function useIsMobile() {
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

export function useDocumentTitle() {
	const [currentTitle, setCurrentTitle] = useState(document.title)

	useEffect(() => {
		// Only update the title if a new title is provided
		if (document.title !== undefined) {
			const prevTitle = document.title // Store the current title
			setCurrentTitle(document.title) // Update the state with the new title

			// Cleanup function to revert to the previous title
			// when the component using this hook unmounts or updates.
			return () => {
				document.title = prevTitle
				setCurrentTitle(prevTitle) // Update the state to the previous title
			}
		}
	}, [document.title]) // Only re-run the effect if the title changes

	return { currentTitle, setCurrentTitle }
}
