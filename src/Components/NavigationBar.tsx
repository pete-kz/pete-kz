/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { Home, Person, Settings } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthUser } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { themeColor } from '@colors'
import { m } from 'framer-motion'

const pages: string[][] = [
	['navigation_bar.pages.1', '/profile'], 
	['navigation_bar.pages.0', '/'], 
	['navigation_bar.pages.2', '/settings']
]
const pagesPaths: string[] = ['/profile', '/', '/settings']

export default function NavigationBar() {

	// States
	const [currentPageIndex, setCurrentPageIndex] = React.useState<number>(0)
	const [count, setCount] = React.useState<number>(0)
	const { t } = useTranslation()

	// Setups
	const navigate = useNavigate()
	const authStateUser = useAuthUser()
	const user: { _id?: string } | null = authStateUser()
	if (user == null) {
		navigate('/login')
	}

	function activeStyle(index: number, currentIndex: number) {
		if (index === currentIndex) {
			return { backgroundColor: themeColor[5], color: '#49454f' }
		}
		return { color: '#49454f' }
	}

	function activeClasses(index: number, currentIndex: number) {
		return `rounded-2xl px-3 transition ease-in-out ${index === currentIndex ? '' : 'bg-none'} text-color-[#49454f]`
	}
		
	React.useEffect(() => {
		setCurrentPageIndex(pagesPaths.indexOf(location.pathname))
	}, [count])

	return (
		<header className="fixed bottom-0 left-0 right-0 w-screen z-50 backdrop-blur" style={{ height: 76, backgroundColor: `${themeColor[3]}ef` }}>
			<div className="flex flex-row items-center justify-around h-full">
				{pages.map((page: string[], index: number) => (
					<m.button key={page[1]} type="button" onClick={() => { navigate(page[1]); setCount(count + 1) }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
						<div className="flex flex-col justify-center items-center">
							<div style={activeStyle(index, currentPageIndex)} className={activeClasses(index, currentPageIndex)}>
								{index === 1 && <Home />}
								{index === 0 && <Person />}
								{index === 2 && <Settings />}
							</div>
							<p style={{ color: '#49454f' }}>{t(page[0])}</p>
						</div>
					</m.button>
				))}
			</div>
		</header>
	)
}
