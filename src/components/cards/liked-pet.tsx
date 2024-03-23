import React, { lazy, useState } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pet_Response, User_Response } from "@/lib/declarations"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { axiosAuth as axios, axiosErrorHandler } from "@utils"
import { API } from "@config"
import { AxiosError, AxiosResponse } from "axios"
import { useTranslation } from "react-i18next"
import { useToast } from "../ui/use-toast"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import { useQuery } from "@tanstack/react-query"

const RemoveLikeAlert = lazy(() => import("@/components/popups/remove-like"))
const PetOverlay = lazy(() => import("../pet-overlay"))

export default function LikedPet({ pet_id, userData, setUserLiked }: { pet_id: Pet_Response["_id"]; userData: User_Response | undefined; setUserLiked: React.Dispatch<React.SetStateAction<Pet_Response[]>> }) {
	// States
	const [open, setOpen] = useState<boolean>(false)

	// Setups
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()
	const { toast } = useToast()
	const authHeader = useAuthHeader()
	const {
		data: pet,
		error: petError,
	}: {
		data: Pet_Response | undefined
		error: AxiosError | null
		isPending: boolean
	} = useQuery({
		queryKey: [`pet_${pet_id}`],
		queryFn: () => axios.get(`${API.baseURL}/pets/find/${pet_id}`).then((res) => res.data),
		refetchInterval: 2000,
	})

	// Functions
	function removePetFromLiked(pet_id: string) {
		// If user is not authenticated, remove pet from local storage
		if (!isAuthenticated() || !userData) {
			// Parse liked pets from local storage
			let browserLiked = JSON.parse(localStorage.getItem("_data_offline_liked") || "[]") as string[]
			// Filter liked pets from unliked pet
			browserLiked = browserLiked.filter((likedPet) => likedPet != pet_id)

			// Fetch all pets
			axios
				.get(`${API.baseURL}/pets/find`)
				.then((res: AxiosResponse) => {
					const allPets: Pet_Response[] = res.data

					// Filter liked pets from all pets that saved locally
					const likedPets = allPets.filter((pet) => {
						return browserLiked.includes(pet._id)
					})

					// Set liked pets to state for rendering
					setUserLiked(likedPets)

					// Save liked pets to local storage
					localStorage.setItem("_data_offline_liked", JSON.stringify(browserLiked))
					toast({ description: t("notifications.liked_remove") })
				})
				.catch(axiosErrorHandler)

			return
		}
		// If user is authenticated, remove pet from user data
		const userPrevData = structuredClone(userData) // Clone user data

		// Filter liked pets from unliked pet
		userPrevData.liked.filter((pet) => pet != pet_id)

		// Removing password field from userData so API does not update the password by accident
		// @ts-expect-error Using interface User_Response that have strict definitions throws error when trying to exclude password from data
		userPrevData.password = undefined

		// Send request to remove liked pet from user data
		axios
			.delete(`${API.baseURL}/users/remove/${userData._id}/liked/${pet_id}`, {
				headers: { Authorization: authHeader! },
			})
			.then(() => {
				toast({ description: t("notifications.liked_remove") })
				// Remove pet from state of liked pets for rendering
				setUserLiked((pets) => pets?.filter((userPet) => userPet._id != pet_id))
			})
			.catch(axiosErrorHandler)
	}

	if (petError) {
		axiosErrorHandler(petError)
	}

	return (
		<Card className="flex items-center justify-between mt-2 p-3 cursor-pointer">
			{pet && (
				<>
					{open && <PetOverlay open setOpen={setOpen} pet={pet} info contacts />}
					<div
						className="w-full"
						onClick={() => {
							setOpen(true)
						}}>
						<div className="flex gap-2 items-center">
							<Avatar>
								<AvatarImage src={pet.imagesPath[0]} alt={pet.name} />
								<AvatarFallback>{pet.name[0]}</AvatarFallback>
							</Avatar>
							<p>{pet.name}</p>
						</div>
					</div>
					<RemoveLikeAlert
						onClick={() => {
							removePetFromLiked(pet._id)
						}}
					/>
				</>
			)}
		</Card>
	)
}
