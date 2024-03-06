/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response, Pet_Filter } from '@declarations'
import { axiosAuth as axios, cn, notification, useQuery, token } from '@utils'
import { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { MoveLeft, MoveRight } from 'lucide-react'
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
	sterilized: undefined,
	sex: '',
	weight: 0,
	owner_type: ''
}

export default function Main() {

	// Setups
	const authStateUser = useAuthUser()
	const user = authStateUser() || {}
	const signout = useSignOut()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()
	const query = useQuery()
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()

	// States
	const [allPets, setAllPets] = useState<Pet_Response[]>([])
	const [allUsers, setAllUsers] = useState<User_Response[]>([])
	const [filteredPets, setFilteredPets] = useState<Pet_Response[]>([])
	const [loadingPets, setLoadingPets] = useState<boolean>(true)
	const [petType, setPetType] = useState<'Cat' | 'Dog' | 'Other'>('Cat')
	const [petIndex, setPetIndex] = useState<number>(0)
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [filter, setFilter] = useState<Pet_Filter>(defaultFilterValue)
	const [openAlertCity, setOpenAlertCity] = useState<boolean>(false)

	// Functions
	function fetchAllPets() {
		const cachedPets = localStorage.getItem('_data_allPets')
		if (cachedPets) {
			setAllPets(JSON.parse(cachedPets))
			setLoadingPets(false)
		}
		axios.get(`${API.baseURL}/pets/find`).then((res: AxiosResponse) => {
			if (!res.data.err) {
				let pets: Pet_Response[] = res.data
				if (isAuthenticated()) {
					axios.get(`${API.baseURL}/users/find/${user._id}`).then((res: AxiosResponse) => {
						if (!res.data.err) {
							const userData: User_Response = res.data
							pets = pets.filter(pet => !(userData.liked.includes(pet._id)))
						} else {
							notification.custom.error(res.data.err)
						}
					})
				} else {
					const browserLiked = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
					pets = pets.filter(pet => !(browserLiked.includes(pet._id)))
				}
				localStorage.setItem('_data_allPets', JSON.stringify(pets))
				setAllPets(pets)
				updateFilteredPets(pets)
				setLoadingPets(false)
			} else {
				notification.custom.error(res.data.err)
			}
		})
	}

	function fetchAllUsers() {
		const cachedPets = localStorage.getItem('_data_allUsers')
		if (cachedPets) {
			setAllUsers(JSON.parse(cachedPets))
		}
		axios.get(`${API.baseURL}/users/find`).then((res: AxiosResponse) => {
			if (!res.data.err) {
				localStorage.setItem('_data_allUsers', JSON.stringify(res.data))
				setAllUsers(res.data)
			} else {
				notification.custom.error(res.data.err)
			}
		})
	}

	function checkQuery() {
		const _pet_id = query.get('start_id')
		const _pet_type = query.get('type')
		if (allPets && _pet_id && _pet_type) {
			allPets.map((pet) => {
				if (pet._id === _pet_id) {
					setPetType(_pet_type as 'Cat' | 'Dog' | 'Other')
					updateFilteredPets()
					setPetIndex(filteredPets.indexOf(pet))
				}
			})
		}
	}

	function checkToken() {
		const isEqualTokens = authHeader() == token
		if (!isEqualTokens) {
			signout()
			localStorage.removeItem('_auth')
		}
	}

	function updateFilteredPets(pets?: Pet_Response[]): void {
		const currentCity = localStorage.getItem('_city')
		const filteredPets = (pets || allPets).filter(pet => {
			const ageCheck = filter.age ? (pet.age >= (filter.age.min ?? pet.age) && pet.age <= (filter.age.max ?? pet.age)) : true
			const typeCheck = filter.type ? pet.type === filter.type : true
			const sterilizedCheck = filter.sterilized !== undefined ? pet.sterilized === filter.sterilized : true
			const sexCheck = filter.sex ? pet.sex === filter.sex : true
			const weightCheck = filter.weight ? pet.weight === filter.weight : true
			// Assuming you have a way to resolve ownerType from ownerID, omitted for brevity
			const ownerTypeCheck = filter.type ? allUsers.filter(user => pet.ownerID === user._id)[0].type === filter.type : true
			const cityCheck = pet.city === currentCity

			return ageCheck && typeCheck && sterilizedCheck && sexCheck && weightCheck && ownerTypeCheck && cityCheck
		})

		setFilteredPets(filteredPets)
	}


	function goToPet() {
		navigate(`/pwa/pets?id=${filteredPets[current]._id}&more=true`)
	}

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
		checkQuery()
		updateFilteredPets()
		checkToken()
	}, [allPets, petType])

	useEffect(() => {
		checkToken()
		fetchAllPets()
		fetchAllUsers()
		if (!localStorage.getItem('_city')) {
			setOpenAlertCity(true)
		}
		// @ts-expect-error because it is imported from the web
		ym(96355513, 'hit', window.origin)
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
			<m.div className='flex h-screen w-screen items-center justify-center' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
				{allPets.length > 0 ? (
					<>
						{filteredPets.length > 0 ? (
							<>
								<Carousel className='p-3' setApi={setApi} opts={{ loop: true, startIndex: petIndex }}>
									<CarouselContent>
										{filteredPets.map(pet => (
											<CarouselItem key={pet._id}>
												<PetCard
													{...pet}
													id={pet._id}
												/>
											</CarouselItem>
										))}
									</CarouselContent>
								</Carousel>
								<div className='absolute bottom-10 flex w-full gap-2 justify-center px-3 mt-2 mb-20'>
									<Button size={'icon'} variant={'secondary'} className='active:scale-95' onClick={() => { api?.scrollPrev() }}><MoveLeft /></Button>
									<Button className='w-1/3 font-bold text-md' onClick={goToPet}>{t('main.pet_card.more')}</Button>
									<Button size={'icon'} variant={'secondary'} className='active:scale-95' onClick={() => { api?.scrollNext() }}><MoveRight /></Button>
								</div>
							</>
						) : <NoMorePetsFilter />}
					</>
				) : loadingPets ? <LoadingSpinner size={12} /> : <NoMorePets />}
			</m.div>
		</>
	)
}

function NoMorePets() {
	const { t } = useTranslation()
	return (
		<Card className='flex justify-center items-center p-4 mx-3 mt-1'>
			<p>{t('main.no_more_pets')}</p>
		</Card>
	)
}

function NoMorePetsFilter() {
	const { t } = useTranslation()
	return (
		<Card className='flex justify-center items-center p-4 mx-3 mt-1'>
			<p>{t('main.no_more_pets_filter')}</p>
		</Card>
	)
}