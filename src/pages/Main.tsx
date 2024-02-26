/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification, useQuery } from '@utils'
import { AxiosResponse } from 'axios'
import PetCard from '@/components/cards/pet'
import { useNavigate } from 'react-router-dom'

// UI 
import { MoveLeft, MoveRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import LoadingSpinner from '@/components/loading-spinner'
import { CarouselItem, Carousel, CarouselContent, CarouselApi } from '@/components/ui/carousel'


export default function Main() {

	// Setups
	const authStateUser = useAuthUser()
	const user = authStateUser() || {}
	const { t } = useTranslation()
	const query = useQuery()
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()

	// States
	const [allPets, setAllPets] = useState<Pet_Response[]>([])
	const [loadingPets, setLoadingPets] = useState<boolean>(true)
	const [petType, setPetType] = useState<'Cat' | 'Dog' | 'Other'>('Cat')
	const [petIndex, setPetIndex] = useState<number>(0)
	const [api, setApi] = React.useState<CarouselApi>()
	const [current, setCurrent] = React.useState(0)

	// Functions
	function fetchAllPets() {
		const cachedPets = localStorage.getItem('_data_allPets')
		if (cachedPets) {
			setAllPets(JSON.parse(cachedPets))
			setLoadingPets(false)
		}
		axios.get(`${API.baseURL}/pets/find/all`).then((res: AxiosResponse) => {
			if (!res.data.err) {
				let pets: Pet_Response[] = res.data
				if (isAuthenticated()) {
					axios.post(`${API.baseURL}/users/find`, { query: { _id: user._id } }).then((res: AxiosResponse) => {
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
				setLoadingPets(false)
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
					setPetIndex(allPets.indexOf(pet))
				}
			})
		}
	}

	function goToPet() {
		navigate(`/pwa/pets?id=${
			allPets
				.filter(pet => petType === pet.type)
				.filter(pet => pet.city === localStorage.getItem('_city'))[current]._id}&more=true`)
	}

	useEffect(() => {
		if (!api) {
			return
		}
		setCurrent(api.selectedScrollSnap())
		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() )
		})
	}, [api])

	useEffect(() => {
		checkQuery()
	}, [allPets])

	useEffect(() => {
		fetchAllPets()
		if (!localStorage.getItem('_city')) {
			notification.custom.error(t('errors.no_city'))
		}
		// @ts-expect-error because it is imported from the web
		ym(96355513, 'hit', window.origin)
	}, [])

	return (
		<>
			<div className='p-3 pb-1'>
				<Select value={petType} onValueChange={(value: string) => {
					setPetType(value as 'Cat' | 'Dog' | 'Other')
				}}>
					<SelectTrigger>
						<SelectValue placeholder={t('pet.type')} />
					</SelectTrigger>
					<SelectContent>
						{['Cat', 'Dog', 'Other'].map((typepet) => (
							<SelectItem key={typepet} value={typepet}>{t(`pet.types.${['Cat', 'Dog', 'Other'].indexOf(typepet)}`)}</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			{allPets.length > 0 ? (
				<>
					<Carousel className='p-3' setApi={setApi} opts={{ loop: true, startIndex: petIndex }}>
						<CarouselContent>
							{allPets
								.filter(pet => petType === pet.type)
								.filter(pet => pet.city === localStorage.getItem('_city'))
								.map(pet => (
									<CarouselItem key={pet._id}>
										<PetCard
											{...pet}
											id={pet._id}
										/>
									</CarouselItem>
								))}
						</CarouselContent>
					</Carousel>
					<div className='flex w-full gap-2 justify-center px-3 mt-2 mb-20'>
						<Button onClick={() => { api?.scrollPrev() }}><MoveLeft /></Button>
						<Button className='w-full' onClick={goToPet}>{t('main.pet_card.more')}</Button>
						<Button onClick={() => { api?.scrollNext() }}><MoveRight /></Button>
					</div>
					{allPets.filter(pet => pet.city === localStorage.getItem('_city')).length < 1 && (
						<Card className='flex justify-center items-center p-4 mx-3 mt-1'>
							<p>{t('main.no_more_pets_city')}</p>
						</Card>
					)}
				</>
			) : loadingPets ?
				(
					<LoadingSpinner />
				) : (
					<Card className='flex justify-center items-center p-4 mx-3 mt-1'>
						<p>{t('main.no_more_pets')}</p>
					</Card>
				)

			}

		</>
	)

}
