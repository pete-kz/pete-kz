/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response, Pet_Filter } from '@declarations'
import { axiosAuth as axios, cn, notification, token } from '@utils'
import { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { LucideCat, LucideDog, MoveLeft, MoveRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/loading-spinner'
import { CarouselItem, Carousel, CarouselContent, CarouselApi } from '@/components/ui/carousel'
import PetFilter from '@/components/pet-filter'
import PetCard from '@/components/cards/pet'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Filter, UserRound } from 'lucide-react'
import { m } from 'framer-motion'

const commonClasses = 'absolute top-0 p-2 z-50 m-2'
const iconSize = 'w-8 h-8'
const defaultFilterValue: Pet_Filter = {
	type: '',
	sterilized: false,
	sex: '',
	weight: 0,
	owner_type: ''
}

/**
 * The main component of the application.
 * Renders a carousel of pet cards and handles fetching pets and users data.
 */
export default function Main() {

	// Setups
	const authStateUser = useAuthUser()
	const user = authStateUser() || {}
	const signout = useSignOut()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()

	// States
	const [allPets, setAllPets] = useState<Pet_Response[]>([])
	const [allUsers, setAllUsers] = useState<User_Response[]>([])
	const [loadingPets, setLoadingPets] = useState<boolean>(true)
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [filter, setFilter] = useState<Pet_Filter>(defaultFilterValue)
	const [openAlertCity, setOpenAlertCity] = useState<boolean>(false)

	// Functions
	function fetchAllPets(page: number = 1) {
		setLoadingPets(true)
		// Checking local storage for pets
		const cachedPets = localStorage.getItem('_data_allPets')
		if (cachedPets) {
			setAllPets(JSON.parse(cachedPets))
			setLoadingPets(false)
		}

		// Creating query string
		const params = new URLSearchParams(filter as Record<string, string>).toString()
		const paginationParams = `page=${page}&limit=10`
		const queryString = `${paginationParams}&${params}`

		// Fetching pets
		axios.get(`${API.baseURL}/pets/recommendations?${queryString}`).then((res: AxiosResponse) => {
			if (res.data.err) {
				return notification.custom.error(res.data.err)
			}
			let pets: Pet_Response[] = res.data

			// Filtering pets that the user already liked
			pets = filterPets(pets)

			// Adding new pets to the existing list if it is not the first page
			if (page !== 1) pets = [...allPets, ...pets]

			// Removing duplicate pets
			const petIds = new Set(allPets.map(pet => pet._id))
			pets = pets.filter(pet => !petIds.has(pet._id))

			// Setting pets and saving to local storage
			localStorage.setItem('_data_allPets', JSON.stringify(allPets.length < 20 ? pets : allPets))
			setAllPets(pets)
			setLoadingPets(false)
		})
	}

	function fetchAllUsers() {
		axios.get(`${API.baseURL}/users/find`).then((res: AxiosResponse) => {
			if (res.data.err) {
				return notification.custom.error(res.data.err)
			}
			setAllUsers(res.data)
		}).catch(err => {
			console.error(err)
		})
	}

	function filterPets(pets: Pet_Response[]) {
		// Filtering pets that the user already liked
		if (isAuthenticated()) {
			axios.get(`${API.baseURL}/users/find/${user._id}`).then((res: AxiosResponse) => {
				if (res.data.err) {
					return notification.custom.error(res.data.err)
				}
				const userData: User_Response = res.data
				pets = pets.filter(pet => !(userData.liked.includes(pet._id)))
			})
		} else {
			const browserLiked = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
			pets = pets.filter(pet => !(browserLiked.includes(pet._id)))
		}
		return pets
	}

	function checkToken() {
		const isEqualTokens = authHeader() == token
		if (!isEqualTokens) {
			signout()
			localStorage.removeItem('_auth')
		}
	}

	useEffect(() => {
		// Checking if current pet is the last one
		if (current === allPets.length - 1) {
			// Fetching more pets
			fetchAllPets(allPets.length / 10 + 1)
			console.log('Fetched more pets.')
		}
	}, [current])

	useEffect(() => {
		if (!api) {
			return
		}
		setCurrent(api.selectedScrollSnap())
		api.on('select', () => {
			setCurrent(api.selectedScrollSnap())
		})
	}, [api])

	useEffect(() => {
		if (localStorage.getItem('_city')) {
			checkToken()
			fetchAllPets()
			fetchAllUsers()
			return
		} 
		setOpenAlertCity(true)
	}, [])

	return (
		<>
			<AlertDialog open={openAlertCity}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t('warning.city.title')}</AlertDialogTitle>
						<AlertDialogDescription>
							{t('warning.city.description')}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={() => { navigate('/pwa/settings') }}>{t('warning.city.confirm')}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<div className={cn(commonClasses, 'left-0')} onClick={() => { navigate('/pwa/profile') }}>
				<UserRound className={iconSize} />
			</div>
			<PetFilter setFilter={setFilter} filter={filter}>
				<Button variant='link' className={cn(commonClasses, 'right-0')}>
					<Filter className={iconSize} />
				</Button>
			</PetFilter>
			<m.div initial={{ opacity: 0, y: 10 }} className='p-4 flex items-center h-screen' animate={{ opacity: 1, y: 0 }}>
				{allPets.length > 0 ? (
					<>
							<Carousel setApi={setApi} className='' opts={{ loop: false }}>
								<CarouselContent>
									{allPets.map(pet => (
										<CarouselItem key={pet._id}>
											<PetCard
												{...pet}
												_id={pet._id}
												user={allUsers.filter(user => user._id === pet.ownerID)[0]}
											/>
										</CarouselItem>
									))}
								</CarouselContent>
							</Carousel>
					</>
				) : loadingPets ? <LoadingSpinner size={12} /> : <NoMorePets />}
			</m.div>
			{allPets.length > 0 && <div className='absolute bottom-10 flex w-full gap-2 justify-center px-3 mt-2 mb-20'>
				<Button size={'icon'} variant={'secondary'} className='active:scale-95' disabled={allPets[current]._id === allPets[0]._id} onClick={() => { api?.scrollPrev() }}><MoveLeft /></Button>
				<Button size={'icon'} variant={'secondary'} className='active:scale-95' disabled={allPets[current]._id === allPets[allPets.length - 1]._id} onClick={() => { api?.scrollNext() }}><MoveRight /></Button>
			</div>}
		</>
	)
}

function NoMorePets() {
	const { t } = useTranslation()
	return (
		<Card className='flex flex-col text-center justify-center items-center p-6'>
			<h1 className='text-2xl font-bold flex gap-2 items-center text-orange-200'><LucideDog />{t('label.noPets')}<LucideCat /></h1>
			<p>{t('text.no_more_pets')}</p>
		</Card>
	)
}