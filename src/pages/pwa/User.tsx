import React, { lazy, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios, { AxiosError } from "axios"
import { API } from "@config"
import { Pet_Response, User_Response } from "@declarations"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import PetOverlayContactSection from "@/components/pet-overlay-contact-section"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"
import { axiosErrorHandler } from "@/lib/utils"

const MyPetIcon = lazy(() => import("@/components/my-pet-icon"))
const UserProfileCard = lazy(() => import("@/components/cards/user-profile"))

export default function User() {
	// Setups
	const { userId } = useParams()
	const { t } = useTranslation()
	const { data: user, isPending } = useQuery<User_Response, AxiosError>({
		queryKey: ["user", userId],
		queryFn: () =>
			axios
				.get(`${API.baseURL}/users/${userId}`)
				.then((res) => res.data)
				.catch(axiosErrorHandler),
	})
	const { data: pets } = useQuery<Pet_Response[], AxiosError>({
		queryKey: ["user", userId, "pets"],
		queryFn: () =>
			axios
				.get(`${API.baseURL}/users/${userId}/pets`)
				.then((res) => res.data)
				.catch(axiosErrorHandler),
	})
	const { updateNavText } = useNav()

	useEffect(() => {
		updateNavText(user?.companyName ? user?.companyName : user?.firstName || "404")
	}, [user])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + (user?.companyName ? user?.companyName : user?.firstName) || "404"}</title>
			</Helmet>
			<div className="mb-20 block w-full gap-2 p-3">
				<div className="space-y-2">
					{isPending ? (
						<div>Loading...</div>
					) : (
						<div className="space-y-2">
							<UserProfileCard user={user!} />
							<div>
								<h1 className="text-2xl font-bold">{t("label.userPets")}</h1>
								<div className="mt-3 grid grid-cols-3 gap-2">
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
