import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from '@/components/theme-provider'
import RequireAuth from '@auth-kit/react-router/RequireAuth'
import AuthProvider from 'react-auth-kit/AuthProvider'
import createStore from 'react-auth-kit/createStore'
import createRefresh from 'react-auth-kit/createRefresh'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import PwaLayout from './layouts/pwa'
import AuthLayout from './layouts/auth'
import WebLayout from './layouts/web'
import LoadingPage from './components/loading-page'
import ProfileSkeleton from './pages/skeletons/profile'
import MainSkeleton from './pages/skeletons/main'
import SettingsSkeleton from './pages/skeletons/settings'
import axios from 'axios'
import { API } from '@config'
import User from './pages/User'
import UserSkeleton from './pages/skeletons/user'

// pages
const Main = lazy(() => import('./pages/Main'))
const Login = lazy(() => import('./pages/Authentication/Login'))
const Register = lazy(() => import('./pages/Authentication/Register'))
const Settings = lazy(() => import('./pages/Settings'))
const Profile = lazy(() => import('./pages/Profile'))
const AddPetPage = lazy(() => import('./pages/PetAdd'))
const IndexPage = lazy(() => import('./pages/Index'))
const SupportPage = lazy(() => import('./pages/Support'))
const AboutUsPage = lazy(() => import('./pages/AboutUs'))

const refresh = createRefresh({
	interval: 60 * 30, // The time in sec to refresh the Access token
	refreshApiCallback: async (param) => {
		try {
			const response = await axios.post(`${API.baseURL}/auth/refresh`, param, {
				headers: { Authorization: `Bearer ${param.authToken}` }
			})
			console.log('Refreshing')
			return {
				isSuccess: true,
				newAuthToken: response.data.token,
				newAuthTokenExpireIn: 60 * 60,
				newRefreshTokenExpiresIn: 60 * 60 * 24
			}
		} catch (error) {
			console.error(error)
			return {
				isSuccess: false,
				newAuthToken: '',
				newAuthTokenExpireIn: 0,
				newRefreshTokenExpiresIn: 0
			}
		}
	}
})

const store = createStore({
	authName: '_auth',
	authType: 'localstorage',
	refresh,
	debug: true
})

const queryClient = new QueryClient()

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider store={store}>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<LazyMotion features={domAnimation}>
						<AnimatePresence>
							<Suspense fallback={<LoadingPage />}>
								<Router>
									<Routes>
										<Route path="/auth" element={<AuthLayout />}>
											<Route path="/auth/login" element={<Login />} />
											<Route path="/auth/register" element={<Register />} />
										</Route>
										<Route element={<WebLayout />}>
											<Route path="/support" element={<SupportPage />} />
											<Route path="/" element={<IndexPage />} />
											<Route path="/about-us" element={<AboutUsPage />} />
										</Route>
										<Route element={<PwaLayout />}>
											<Route path="/pwa" element={
												<Suspense fallback={<MainSkeleton />}>
													<Main />
												</Suspense>
											} />
											<Route path="/pwa/profile" element={
												<Suspense fallback={<ProfileSkeleton />}>
													<Profile />
												</Suspense>
											} />
											<Route path="/pwa/settings" element={
												<Suspense fallback={<SettingsSkeleton />}>
													<Settings />
												</Suspense>
											} />
											<Route path="/pwa/users/:userId" element={
												<Suspense fallback={<UserSkeleton />}>
													<User />
												</Suspense>
											} />
											<Route
												path="/pwa/pets/add"
												element={<RequireAuth fallbackPath="/auth/login"><AddPetPage /></RequireAuth>}
											/>
										</Route>
									</Routes>
								</Router>
							</Suspense>
						</AnimatePresence>
					</LazyMotion>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
