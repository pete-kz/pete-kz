import React, { useEffect, useState, lazy, Suspense } from "react"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { API } from "@config"
import { AuthState, Pet_Response } from "@declarations"
import { useNavigate } from "react-router-dom"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import MobilePageHeader from "@/components/mobile-page-header"
import AddPetCard from "@/components/cards/add-pet"
import { useQuery } from "@tanstack/react-query"
import { Helmet } from "react-helmet"

const LikedPet = lazy(() => import("@/components/cards/liked-pet"))
const MyPetIcon = lazy(() => import("@/components/my-pet-icon"))
const UserProfileCard = lazy(() => import("@/components/cards/user-profile"))

export default function Profile() {
	// Setups
	const user = useAuthUser<AuthState>()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const {
		data: petsData,
		error: petsError,
		isPending: petsPending,
	} = useQuery({
		queryKey: ["pets"],
		queryFn: () => axios.get(`${API.baseURL}/pets/find`).then((res) => res.data),
		refetchInterval: 2000,
	})
	const {
		data: userData,
		error: userError,
		isPending: userPending,
	} = useQuery({
		queryKey: ["user", user?._id],
		queryFn: () => axios.get(`${API.baseURL}/users/find/${user?._id}`).then((res) => res.data),
		refetchInterval: 2000,
	})

	// States
	const [userPets, setUserPets] = useState<Pet_Response[]>([])
	const [userLiked, setUserLiked] = useState<Pet_Response[]>([])

	useEffect(() => {
		if (petsData) {
			const likedIds: string[] = userData?.liked || (JSON.parse(localStorage.getItem("_data_offline_liked") || "[]") as string[])
			setUserPets((petsData as Pet_Response[]).filter((pet) => pet.ownerID === user?._id))
			setUserLiked((petsData as Pet_Response[]).filter((pet) => likedIds.includes(pet._id)))
		}
	}, [petsData, userData])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.profile")}</title>
			</Helmet>
			<MobilePageHeader title={t("header.profile")} to="/pwa" />
			<div className="mb-20 block w-full gap-2 p-3">
				<Suspense fallback={<div>Loading...</div>}>
					{isAuthenticated() ? (
						userData && <UserProfileCard user={userData} />
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
						{userPending && petsPending && <div>Loading...</div>}
						{userData && userPets?.map((pet, index) => <MyPetIcon key={index} _id={pet._id} setUserPets={setUserPets} />)}
						<AddPetCard />
					</div>
				</div>

				{userPending && petsPending && <div>Likes loading...</div>}

				{userLiked.length > 0 && (
					<div className="p-1">
						<p>{t("label.myLikes")}</p>

						{userLiked.map((pet, index) => (
							<LikedPet setUserLiked={setUserLiked} key={index} pet_id={pet._id} userData={userData} />
						))}
					</div>
				)}
				<div className="absolute bottom-5 right-5">
					<SettingsButton />
				</div>
				{userError && <div>{userError.message}</div>}
				{petsError && <div>{petsError.message}</div>}
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
