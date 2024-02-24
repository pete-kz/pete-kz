/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'
import { useAnimate, motion as m, PanInfo } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification, useQuery } from '@utils'
import { AxiosResponse } from 'axios'
import PetCard from '@/components/Cards/pet'

// UI 
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import LoadingSpinner from '@/components/loading-spinner'


export default function Main() {

	// Setups
	const authStateUser = useAuthUser()
	const user = authStateUser() || {}
	const { t } = useTranslation()
	const query = useQuery()
	const [scope, animate] = useAnimate()
	const isAuthenticated = useIsAuthenticated()

	// States
	const [allPets, setAllPets] = useState<Pet_Response[]>([])
	const [petIndex, setPet] = useState<number>(0)
	const [loadingPets, setLoadingPets] = useState<boolean>(true)
	const [petType, setPetType] = useState<'Cat' | 'Dog' | 'Other'>('Cat')
	// Handlers
	function changePet(type: 'n' | 'p') {
		const pet_id = query.get('start_id')
		const _pet_type = query.get('type')
		if (pet_id || _pet_type) {
			query.delete('start_id')
			query.delete('type')
		}
		if (type === 'n' && petIndex != (allPets.filter(pet => pet.type === _pet_type).length - 1)) {
			return animate(scope.current, { opacity: 0, x: -400 }, { duration: .45 }).then(() => {
				animate(scope.current, { x: 400 }, { duration: 0 }).then(() => {
					setPet(pet => pet + 1)
				})
			})
		}
		if (petIndex != 0 && type === 'p') {
			return animate(scope.current, { opacity: 0, x: 400 }, { duration: .45 }).then(() => {
				animate(scope.current, { x: -400 }, { duration: 0 }).then(() => {
					setPet(pet => pet - 1)
				})
			})
		}
	}

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
					setPetType(_pet_type as 'Cat' | 'Dog' | 'Other')
					setPet(allPets.filter(pet => pet.type === _pet_type).indexOf(pet))
				}
			})
		}
	}

	function checkDrag(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void {
		if (info.point.x >= 400 && !(petIndex == 0)) changePet('p')
		if (info.point.x <= 150 && !(petIndex == (allPets.filter(pet => petType === pet.type).length - 1) && allPets.filter(pet => petType === pet.type).length > 0) ) changePet('n')
	}

	useEffect(() => {
		fetchAllPets()
		animate(scope.current, { opacity: 1, x: 0 }, { duration: .45 })
	}, [petIndex])

	useEffect(() => {
		checkQuery()
	}, [allPets])

	useEffect(() => {
		if (!localStorage.getItem('_city')) {
			notification.custom.error(t('errors.no_city'))
		}
		// @ts-expect-error because it is imported from the web
		ym(96355513, 'hit', window.origin)
	}, [])

	return (
		<>
			<div className='p-3'>
				<Select value={petType} onValueChange={(value) => {
					setPetType(value as 'Cat' | 'Dog' | 'Other')
					setPet(0)
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
			<div className="flex justify-center h-screen">
				<m.div id='pet_card' drag='x' onDragEnd={checkDrag} dragConstraints={{ top: 0, bottom: 0, left: 30, right: 30 }} dragSnapToOrigin className='h-fit' ref={scope} dragElastic={0.2} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
					{allPets.length > 0 ? (
						<>
							{allPets.filter(pet => petType === pet.type).map((pet, index: number) => (
								pet?.city === localStorage.getItem('_city') && (
									index === petIndex && (
										<PetCard
											key={index}
											imagesPath={pet.imagesPath}
											age={pet.age}
											type={pet.type}
											name={pet.name}
											description={pet.description}
											id={pet._id}
											userID={pet.userID}
											city={pet.city}
											createdAt={pet.createdAt}
											updatedAt={pet.updatedAt}
										/>
									))))}
							{allPets.filter(pet => pet.city === localStorage.getItem('_city')).length < 1 && (
								<Card className='flex justify-center items-center p-4 mx-4'>
									<p>{t('main.no_more_pets_city')}</p>
								</Card>
							)}
						</>
					) : loadingPets ?
						(
							<LoadingSpinner />
						) : (
							<Card className='flex justify-center items-center p-4 mx-4'>
								<p>{t('main.no_more_pets')}</p>
							</Card>
						)

					}
				</m.div>
			</div>
		</>
	)

}
