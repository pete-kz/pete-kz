import React, { useEffect, lazy, Suspense } from "react"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useTranslation } from "react-i18next"
import axios, { AxiosError } from "axios"
import { API } from "@config"
import { Pet_Response } from "@declarations"
import { useNavigate } from "react-router-dom"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddPetCard from "@/components/cards/add-pet"
import { useQuery } from "@tanstack/react-query"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import { axiosErrorHandler } from "@/lib/utils"

const LikedPet = lazy(() => import("@/components/cards/liked-pet"))
const MyPetIcon = lazy(() => import("@/components/my-pet-icon"))
const MyProfileCard = lazy(() => import("@/components/cards/my-profile"))

export default function Profile() {
	// Setups
	const isAuthenticated = useIsAuthenticated()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const {
		data: userPets,
		error: userPetsError,
		isPending: userPetsPending,
	} = useQuery<Pet_Response[], AxiosError>({
		queryKey: ["me", "pets", isAuthenticated],
		queryFn: () => axios.get(`${API.baseURL}/me/pets`, { headers: { Authorization: authHeader } }).then((res) => res.data),
		retry(failureCount, error) {
			if (error.response?.status === 401) {
				return false
			}
			return failureCount < 2
		},
	})

	const {
		data: likedPets,
		error: likedPetsError,
		isPending: likedPetsPending,
	} = useQuery<Pet_Response[], AxiosError>({
		queryKey: ["me", "pets", isAuthenticated, "liked"],
		queryFn: () => axios.get(`${API.baseURL}/me/liked`, { headers: { Authorization: authHeader }}).then((res) => res.data),
		retry(failureCount, error) {
			if (error.response?.status === 401) {
				return false
			}
			return failureCount < 2
		},
	})
	
	const { updateNavText } = useNav()

	if (userPetsError) {
		console.error(userPetsError)
	}

	if (likedPetsError) {
		console.error(likedPetsError)
	}

	useEffect(() => {
		updateNavText(t("header.profile"))
	}, [])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.profile")}</title>
			</Helmet>
			<div className="mb-20 block w-full gap-2 p-3">
				<Suspense fallback={<div>Loading...</div>}>
					{isAuthenticated ? (
						<MyProfileCard />
					) : (
						<Button
							variant={"secondary"}
							className="w-full gap-2 font-bold"
							onClick={() => {
								navigate("/auth/login")
							}}>
							{t("button.authorization")}
						</Button>
					)}
				</Suspense>

				<div className="mt-3 p-1">
					<p>{t("label.myPets")}</p>
					<div className="mt-2 grid grid-cols-3 gap-2">
						{userPetsPending && <div>Loading...</div>}
						{userPets?.map((pet, index) => <MyPetIcon key={index} _id={pet._id} />)}
						<AddPetCard />
					</div>
				</div>

				{likedPetsPending && <div>Likes loading...</div>}

				{likedPets && likedPets.length > 0 && (
					<div className="p-1">
						<p>{t("label.myLikes")}</p>

						{likedPets?.map((pet, index) => (
							<LikedPet key={index} pet_id={pet._id} setUserLiked={() => {}} />
						))}
					</div>
				)}
				<div className="fixed bottom-5 right-5">
					<SettingsButton />
				</div>
			</div>
		</>
	)
}

function SettingsButton() {
	// Setups
	const navigate = useNavigate()

	return (
		<button className="rounded-full bg-primary p-3 text-border" onClick={() => navigate("/pwa/settings")}>
			<Settings className="h-8 w-8" />
		</button>
	)
}
