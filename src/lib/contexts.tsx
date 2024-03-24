import React, { createContext, useContext, useState } from "react"

interface NavContextType {
	navText: string
	updateNavText: (text: string) => void
}

// Define the context
const NavContext = createContext<NavContextType>({ navText: "", updateNavText: () => {} })

// Export the useNav custom hook for easy context consumption
export const useNav = () => useContext(NavContext)

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
	const [navText, setNavText] = useState("") // Default text

	// Function to update the navigation text
	const updateNavText = (text: string) => setNavText(text)

	return <NavContext.Provider value={{ navText, updateNavText }}>{children}</NavContext.Provider>
}
