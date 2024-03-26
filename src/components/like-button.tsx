/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from "react"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useTranslation } from "react-i18next"
import { API } from "@config"
import { User_Response, type Pet_Response, AuthState } from "@declarations"
import { axiosAuth as axios, axiosErrorHandler } from "@utils"
import { AxiosResponse } from "axios"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

import { useToast } from "./ui/use-toast"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"

export default function LikeButton(props: { pet: Pet_Response }) {
	// Setups
	const user = useAuthUser<AuthState>()
	const { t } = useTranslation()
	const isAuthenticated = useIsAuthenticated()
	const { toast } = useToast()
	const authHeader = useAuthHeader()

	// States
	const [userData, setUserData] = useState<User_Response>()
	const [liked, setLiked] = useState<boolean>(false)

	// Functions
	function likePet() {
		if (!liked) {
			if (!isAuthenticated || !userData) {
				const browserLiked = JSON.parse(localStorage.getItem("_data_offline_liked") || "[]") as string[]
				browserLiked.push(props.pet._id)
				localStorage.setItem("_data_offline_liked", JSON.stringify(browserLiked))
				toast({
					description: t("pet.liked") + " " + props.pet.name + "!",
				})
				setLiked(true)
				return
			}
			const userPrevData = structuredClone(userData)
			userPrevData.liked.push(props.pet._id)
			// @ts-expect-error Using interface User_Response that have strict definitions throws error when trying to exclude password from data
			userPrevData.password = undefined
			axios.post(`${API.baseURL}/me`, {
					update: userPrevData,
				}, { headers: { Authorization: authHeader }})
				.then(() => {
					toast({
						description: t("pet.liked") + " " + props.pet.name + "!",
					})
					setLiked(true)
				})
				.catch(axiosErrorHandler)
				.finally(() => setLiked(true))
		} else {
			removePetFromLiked(props.pet._id)
			setLiked(false)
		}
	}

	function removePetFromLiked(pet_id: string) {
		// If user is not authenticated, remove pet from local storage
		if (!isAuthenticated || !userData) {
			// Parse liked pets from local storage
			let browserLiked = JSON.parse(localStorage.getItem("_data_offline_liked") || "[]") as string[]
			// Filter liked pets from unliked pet
			browserLiked = browserLiked.filter((likedPet) => likedPet != pet_id)

			localStorage.setItem("_data_offline_liked", JSON.stringify(browserLiked))
			toast({ description: t("notifications.liked_remove") })

			return
		}
		// If user is authenticated, remove pet from user data
		// Send request to remove liked pet from user data
		axios.delete(`${API.baseURL}/me/liked/${pet_id}/remove`, { headers: { Authorization: authHeader }})
			.then(() => {
				toast({ description: t("notifications.liked_remove") })
			})
			.catch(axiosErrorHandler)
	}

	function getUser() {
		if (isAuthenticated && user) {
			axios
				.get(`${API.baseURL}/me`, { headers: { Authorization: authHeader }} )
				.then((res: AxiosResponse) => {
					const user: User_Response = res.data
					setUserData(user)
					if (user.liked.includes(props.pet._id)) {
						setLiked(true)
					}
				})
				.catch(axiosErrorHandler)
		}
	}

	useEffect(() => {
		getUser()
	}, [])

	return (
		<div className="fixed bottom-2 right-2">
			<Button variant={"outline"} size={"icon"} className="w-fit gap-2 rounded-full p-6" style={{ color: "#FF0000" }} onClick={likePet}>
				<span className="text-white">{t("label.addToLiked")}</span>
				<Heart fill={liked ? "#FF0000" : "transparent"} />
			</Button>
		</div>
	)
}
