/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { Home, Person, PostAddOutlined, AdminPanelSettingsOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthUser } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { axiosAuth as axios, notification } from '@utils'
import { API } from '@config'
import { themeColor } from '@colors'
import { AxiosResponse } from 'axios'

const pages: string[][] = [['navigation_bar.pages.0', '/'], ['navigation_bar.pages.1', '/request'], ['navigation_bar.pages.2', '/settings']]
const pagesPaths: string[] = ['/', '/request', '/settings']

export default function NavigationBar() {

	// States
	const [ADMINS, setADMINS] = React.useState<string[]>([])
	const [currentPageIndex, setCurrentPageIndex] = React.useState<number>(0)
	const [count, setCount] = React.useState<number>(0)
	const { t } = useTranslation()

	// Setups
	const navigate = useNavigate()
	const authStateUser = useAuthUser()
	const user: { _id?: string } | null = authStateUser()
	const isAdmin: boolean = ADMINS.includes(user!._id ?? '12345678')
	if (user == null) {
		navigate('/login')
	}

	// Functions
	function fetchAdmins() {
		axios.get(`${API.baseURL}/config/`).then((response: AxiosResponse) => {
			if (!response.data.err) {
				const { admins } = response.data
				setADMINS(admins)
			} else {
				notification.custom.error(response.data.err)
			}
		})
	}

	function activeStyle(index: number, currentIndex: number) {
		if (index === currentIndex) {
			return { backgroundColor: themeColor[5] }
		}
		return {}
	}

	function activeClasses(index: number, currentIndex: number) {
		if (index === currentIndex) {
			return 'rounded-2xl px-3 transition ease-in-out'
		}
		return 'rounded-2xl px-3 transition ease-in-out bg-none'
	}

	React.useEffect(() => {
		fetchAdmins()
		setCurrentPageIndex(pagesPaths.indexOf(location.pathname))
	}, [count])

	return (
		<header className="fixed bottom-0 left-0 right-0 w-screen z-50 backdrop-blur" style={{ height: 76, backgroundColor: `${themeColor[3]}ef` }}>
			<div className="flex flex-row items-center justify-around h-full">
				{pages.map((page: string[], index: number) => (
					<button key={page[1]} type="button" onClick={() => { navigate(page[1]); setCount(count + 1) }}>
						<div className="flex flex-col justify-center items-center">
							<div style={activeStyle(index, currentPageIndex)} className={activeClasses(index, currentPageIndex)}>
								{index === 0 && <Home />}
								{index === 1 && <PostAddOutlined />}
								{index === 2 && <Person />}
							</div>
							<p>{t(page[0])}</p>
						</div>
					</button>
				))}
				{isAdmin
					&& (
						<button type="button" onClick={() => { window.location.href = 'http://admin.allymap.info/'; setCount(count + 1) }}>
							<div className="flex flex-col justify-center items-center">
								<div style={activeStyle(3, currentPageIndex)} className={activeClasses(3, currentPageIndex)}>
									<AdminPanelSettingsOutlined />
								</div>
								<p>Admin</p>
							</div>
						</button>
					)}
			</div>
		</header>
	)
}
