/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { m, AnimatePresence, useAnimate } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification, useQuery } from '@utils'
import { AxiosResponse } from 'axios'
import PetCard from '@/Components/Cards/Pet.card'
import toast from 'react-hot-toast'
import { themeColor } from '@/Utils/colors'
import { Button, Icon, IconButton } from '@mui/material'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'


const cities: string[] = ['Алматы', 'Астана', 'Шымкент']

export default function Main() {

	// Setups
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()
	const authStateUser = useAuthUser()
	const user = authStateUser() || {}
	const signout = useSignOut()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()
	const query = useQuery()
	const [scope, animate] = useAnimate()

	// States
	const [allPets, setAllPets] = useState<Pet_Response[]>([])
	const [petIndex, setPet] = useState<number>(0)
	const [city, setCity] = useState<string>('')

	// Handlers
	function changePet(type: 'n' | 'p') {
		if (type === 'n' && petIndex != (allPets.length - 1)) {
			console.log(1)
			return animate(scope.current, { opacity: 0, x: -400 }, { duration: .45 }).then(() => {
				animate(scope.current, { x: 400 },  { duration: 0 }).then(() => {
					setPet(pet => pet + 1)
				})
			})
		}
		if (petIndex != 0 && type === 'p') {
			return animate(scope.current, { opacity: 0, x: 400 }, { duration: .45 }).then(() => {
				animate(scope.current, { x: -400 },  { duration: 0 }).then(() => {
					setPet(pet => pet - 1)
				})
			})
		}
	}

	// Functions
	function fetchAllPets() {

		axios.post(`${API.baseURL}/pets/find`, {}).then((res: AxiosResponse) => {
			if (!res.data.err) {
				const pets: Pet_Response[] = res.data
				axios.post(`${API.baseURL}/users/find`, { query: { _id: user._id } }).then((res: AxiosResponse) => {
					if (!res.data.err) {
						const userData: User_Response = res.data
						// if pet already in users skipped or liked, filter them out
						setAllPets(pets.filter(pet => !(userData.liked.includes(pet._id))))
					} else {
						notification.custom.error(res.data.err)
					}
				})

			} else {
				notification.custom.error(res.data.err)
			}
		})

	}

	function checkToken() {
		const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem('_auth')}`
		const isEqualTokens = authHeader() == token
		if (!isEqualTokens) {
			signout()
		}
	}

	function checkQuery() {
		const pet_id = query.get('start_id')
		if (allPets && pet_id) {
			allPets.map((pet) => {
				if (pet._id === pet_id) setPet(allPets.indexOf(pet))
			})
		}
	}

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate('/login')
		}
		fetchAllPets()
		checkToken()
		animate(scope.current, { opacity: 1, x: 0 }, { duration: .45 })
	}, [petIndex])

	useEffect(() => {
		checkQuery()
	}, [allPets])

	return (
		<>
			<div className="flex justify-center items-center h-screen">
				<div className='absolute w-screen flex items-center justify-center bottom-[6rem]'>
					<div className='flex items-center gap-3'>
						<IconButton sx={{
							color: themeColor.iconButtonColor, background: themeColor.cardBackground,
							':active': {
								background: themeColor.cardBackground
							}, ':hover': {
								background: themeColor.cardBackground
							},
						}} onClick={() => {
							changePet('p')
						}}><ArrowLeft /></IconButton>
						<IconButton sx={{
							color: themeColor.iconButtonColor, background: themeColor.cardBackground,
							':active': {
								background: themeColor.cardBackground
							}, ':hover': {
								background: themeColor.cardBackground
							}
						}} onClick={() => {
							changePet('n')
						}}><ArrowRight /></IconButton>
					</div>
				</div>
				<div id='pet_card' ref={scope}>
					{allPets.length > 0 ? (
						<>
							{allPets.map((pet, index: number) => (
								pet?.city?.includes(city) && (
									index === petIndex && (


										<PetCard
											key={index}
											imagesPath={pet.imagesPath}
											age={pet.age}
											type={pet.type}
											name={pet.name}
											description={pet.description}
											id={pet._id}
											userID={user._id}
											city={pet.city}
										/>


									))))}

						</>
					)
						:
						(
							<div className='w-screen h-screen flex justify-center items-center px-3'>
								<p>There are no more pets to show for you! Check liked and skipped or wait a little while for new ones to come!</p>
							</div>
						)
					}
				</div>
			</div>
		</>
	)

}
