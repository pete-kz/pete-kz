import { useState, useEffect, useCallback } from "react"
import { AuthState, Pet_Filter, Pet_Response, User_Response } from "./declarations"
import axios, { AxiosResponse } from "axios"
import { API } from "@config"
import { axiosErrorHandler } from "./utils"
import { toast } from "@/components/ui/use-toast"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"

export function useGetReccommendations(page: number = 1, filter?: Pet_Filter) {
	const isAuthenticated = useIsAuthenticated()
	const user = useAuthUser<AuthState>()

	const [allPets, setAllPets] = useState<Pet_Response[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [userLoading, setUserLoading] = useState<boolean>(false)
	const [updatingCache, setUpdatingCache] = useState<boolean>(false)

	const buildQueryString = useCallback((page: number): string => {
		const params = new URLSearchParams(filter as Record<string, string>).toString()
		const paginationParams = `page=${page}&limit=10`
		return `${paginationParams}&${params}`
	}, [filter])

	const getCached = useCallback(() => {
		const cachedPets = localStorage.getItem("_data_allPets")
		if (cachedPets) {
			setAllPets(JSON.parse(cachedPets))
			setLoading(false)
			setUpdatingCache(true)
		}
	}, [])

	const cachePets = useCallback((pets: Pet_Response[]): void => {
		localStorage.setItem("_data_allPets", JSON.stringify(allPets.length < 20 ? pets : allPets))
		setAllPets(pets)
	}, [allPets])

	const addNewPets = useCallback((pets: Pet_Response[], page: number): Pet_Response[] => {
		return page !== 1 ? [...allPets, ...pets] : pets
	}, [allPets])

	const removeDuplicatePets = useCallback((pets: Pet_Response[]): Pet_Response[] => {
		const petIds = new Set(allPets.map((pet) => pet._id))
		return pets.filter((pet) => !petIds.has(pet._id))
	}, [allPets])

	const filterPets = useCallback((pets: Pet_Response[]) => {
		if (isAuthenticated() && user) {
			setUserLoading(true)
			axios
				.get(`${API.baseURL}/users/find/${user._id}`)
				.then((res: AxiosResponse) => {
					const userData: User_Response = res.data
					pets = pets.filter((pet) => !userData.liked.includes(pet._id))
					pets = pets.filter((pet) => pet.ownerID !== user._id)
				})
				.catch(axiosErrorHandler)
				.finally(() => { setUserLoading(false) })
		} else {
			const browserLiked = JSON.parse(localStorage.getItem("_data_offline_liked") || "[]") as string[]
			pets = pets.filter((pet) => !browserLiked.includes(pet._id))
		}
		return pets
	}, [isAuthenticated, user])

	useEffect(() => {
		setLoading(true)
		getCached()
		const queryString = buildQueryString(page)
		axios
			.get(`${API.baseURL}/pets/recommendations?${queryString}`)
			.then((res: AxiosResponse) => {
				let pets: Pet_Response[] = res.data
				pets = filterPets(pets)
				pets = addNewPets(pets, page)
				pets = removeDuplicatePets(pets)
				cachePets(pets)
				toast({ description: "Pets updated!" })
			})
			.catch(axiosErrorHandler)
			.finally(() => {
				setLoading(false)
				setUpdatingCache(false)
			})
	}, [page, filter?.owner_type, filter?.sex, filter?.sterilized, filter?.type, filter?.weight])

	return {
		data: allPets,
		loading: (loading || userLoading),
		updatingCache: updatingCache
	}
}
