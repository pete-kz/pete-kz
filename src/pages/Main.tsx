/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response, Pet_Filter, AuthState } from '@declarations'
import { axiosAuth as axios, cn, defaultFilterValue, axiosErrorHandler } from '@utils'
import { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { LucideCat, LucideDog, MoveLeft, MoveRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/loading-spinner'
import { CarouselItem, Carousel, CarouselContent, CarouselApi } from '@/components/ui/carousel'
import { Filter, UserRound } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const commonClasses = 'absolute top-0 p-2 z-50 m-2'
const iconSize = 'w-8 h-8'

const CityAlert = React.lazy(() => import('@/components/popups/city-alert'))
const PetFilter = React.lazy(() => import('@/components/pet-filter'))
const PetCard = React.lazy(() => import('@/components/cards/pet'))

/**
 * The main component of the application.
 * Renders a carousel of pet cards and handles fetching pets and users data.
 */
export default function Main() {

	// Setups
	const user = useAuthUser<AuthState>()
	const { t } = useTranslation()
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()
	const { toast } = useToast()
	const [openAlertCity, setOpenAlertCity] = useState<boolean>(false)


	// States
	const [allPets, setAllPets] = useState<Pet_Response[]>([])
	const [allUsers, setAllUsers] = useState<User_Response[]>([])
	const [loadingPets, setLoadingPets] = useState<boolean>(true)
	const [updatingCache, setUpdatingCache] = useState<boolean>(false)
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [filter, setFilter] = useState<Pet_Filter>(defaultFilterValue)

	// Functions
	function buildQueryString(page: number): string {
		const params = new URLSearchParams(filter as Record<string, string>).toString()
		const paginationParams = `page=${page}&limit=10`
		return `${paginationParams}&${params}`
	}

	function filterPets(pets: Pet_Response[]) {
		// Filtering pets that the user already liked
		if (isAuthenticated() && user) {
			axios.get(`${API.baseURL}/users/find/${user._id}`).then((res: AxiosResponse) => {
				const userData: User_Response = res.data
				pets = pets.filter(pet => !(userData.liked.includes(pet._id)))
				pets = pets.filter(pet => pet.ownerID !== user._id)
			}).catch(axiosErrorHandler)
		} else {
			const browserLiked = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
			pets = pets.filter(pet => !(browserLiked.includes(pet._id)))
		}
		return pets
	}

	function addNewPets(pets: Pet_Response[], page: number): Pet_Response[] {
		if (page !== 1) {
			pets = [...allPets, ...pets]
		}
		return pets
	}

	function removeDuplicatePets(pets: Pet_Response[]): Pet_Response[] {
		const petIds = new Set(allPets.map(pet => pet._id))
		pets = pets.filter(pet => !petIds.has(pet._id))
		return pets
	}

	function savePetsToLocal(pets: Pet_Response[]): void {
		localStorage.setItem('_data_allPets', JSON.stringify(allPets.length < 20 ? pets : allPets))
		setAllPets(pets)
	}

	function fetchAllPets(page: number = 1) {
		setLoadingPets(true)
		const cachedPets = localStorage.getItem('_data_allPets')
		if (cachedPets) {
			setAllPets(JSON.parse(cachedPets))
			setLoadingPets(false)
			setUpdatingCache(true)
		}
		const queryString = buildQueryString(page)
		axios.get(`${API.baseURL}/pets/recommendations?${queryString}`)
			.then((res: AxiosResponse) => {
				let pets: Pet_Response[] = res.data
				pets = filterPets(pets)
				pets = addNewPets(pets, page)
				pets = removeDuplicatePets(pets)
				savePetsToLocal(pets)
				toast({ description: 'Pets updated!' })
				setLoadingPets(false)
				setUpdatingCache(false)
			})
			.catch(axiosErrorHandler)
			.finally(() => {
				setLoadingPets(false)
				setUpdatingCache(false)
			})
	}

	function fetchAllUsers() {
		axios.get(`${API.baseURL}/users/find`).then((res: AxiosResponse) => {
			if (res.data.err) {
				return toast({ description: res.data.err })
			}
			setAllUsers(res.data)
		}).catch(axiosErrorHandler)
	}

	function updateFilter(filter: Pet_Filter) {
		setFilter(() => filter)
		fetchAllPets()
	}

	useEffect(() => {
		// Checking if current pet is the last one
		if (current === allPets.length - 1 && allPets.length % 10 === 0) {
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
			fetchAllPets()
			fetchAllUsers()
			return
		}
		setOpenAlertCity(true)
	}, [])

	return (
		<>
			{openAlertCity && <CityAlert setOpen={setOpenAlertCity} />}
			<div className={cn(commonClasses, 'left-0')} onClick={() => { navigate('/pwa/profile') }}>
				<UserRound className={iconSize} />
			</div>
			<PetFilter updateFilter={updateFilter} filter={filter}>
				<Button variant='link' className={cn(commonClasses, 'right-0')}>
					<Filter className={iconSize} />
				</Button>
			</PetFilter>
			<div className='p-4 flex flex-col items-center w-full justify-center h-screen'>
				<div className='max-w-md'>
					{loadingPets ? <LoadingSpinner size={12} /> : allPets.length > 0 ? (
						<>
							{updatingCache && !loadingPets && <p className='animate-pulse font-semibold bg-card p-4 mb-2 rounded-lg border w-full'>{t('label.updatePets')}...</p>}
							<Carousel setApi={setApi} className='mb-5' opts={{ loop: false }}>
								<CarouselContent>
									{typeof allUsers.filter === 'function' && allPets.map(pet => (
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
							{typeof allUsers.filter === 'function' &&
								<div className='flex w-full gap-2 justify-center px-3 mt-2'>
									<Button size={'icon'} variant={'secondary'} className='active:scale-95' disabled={allPets[current]._id === allPets[0]._id} onClick={() => { api?.scrollPrev() }}><MoveLeft /></Button>
									<Button size={'icon'} variant={'secondary'} className='active:scale-95' disabled={allPets[current]._id === allPets[allPets.length - 1]._id} onClick={() => { api?.scrollNext() }}><MoveRight /></Button>
								</div>
							}
						</>
					) : (
						<NoMorePets />
					)}
				</div>
			</div>
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