import React, { lazy } from "react"
import { useTranslation } from "react-i18next"
import axios, { AxiosError } from "axios"
import { API } from "@config"
import { Pet_Response, User_Response } from "@declarations"
import { useParams } from "react-router-dom"
import MobilePageHeader from "@/components/mobile-page-header"
import { useQuery } from "@tanstack/react-query"
import PetOverlayContactSection from "@/components/pet-overlay-contact-section"

const MyPetIcon = lazy(() => import("@/components/my-pet-icon"))
const UserProfileCard = lazy(() => import("@/components/cards/user-profile"))

export default function User() {
	// Setups
	const { userId } = useParams()
	const { t } = useTranslation()
	const {
		data: user,
		error,
		isPending,
	} = useQuery<User_Response, AxiosError>({
		queryKey: ["user", userId],
		queryFn: () => axios.get(`${API.baseURL}/users/find/${userId}`).then((res) => res.data),
	})
	const { data: pets } = useQuery<Pet_Response[], AxiosError>({
		queryKey: ["user_pets", userId],
		queryFn: () =>
			axios.get(`${API.baseURL}/pets/find/`).then((res) => {
				return (res.data as Pet_Response[]).filter((pet) => pet.ownerID === user?._id)
			}),
	})

	return (
		<>
			<MobilePageHeader to="/pwa" title={(user?.companyName ? user?.companyName : user?.firstName) || "404"} />
			<div className="block w-full gap-2 p-3 mb-20">
				<div className="space-y-2">
					{error && <div>{t("errors.user_not_found")}</div>}
					{isPending ? (
						<div>Loading...</div>
					) : (
						<div className="space-y-2">
							<UserProfileCard user={user!} />
							<div>
								<h1 className="text-2xl font-bold">{t("label.userPets")}</h1>
								<div className="grid grid-cols-3 mt-3">
									{pets?.map((pet) => <MyPetIcon key={pet._id} {...pet} />)}
									{pets?.length === 0 && t("label.noPets")}
								</div>
							</div>
							{user && <PetOverlayContactSection user={user} />}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
