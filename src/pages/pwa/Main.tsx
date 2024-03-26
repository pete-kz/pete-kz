/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useTranslation } from "react-i18next"
import { API } from "@config"
import { Pet_Filter, AuthState, Pet_Response } from "@declarations"
import { axiosAuth as axios, cn, defaultFilterValue, axiosErrorHandler, isPWA } from "@utils"
import { useNavigate } from "react-router-dom"
import { LucideCat, LucideDog, MoveLeft, MoveRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CarouselItem, Carousel, CarouselContent, CarouselApi } from "@/components/ui/carousel"
import { Filter, UserRound } from "lucide-react"
import PWAInstallComponent from "@/components/pwa-install"
import React, { useState, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { AxiosResponse } from "axios"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import PetCard from "@/components/cards/pet"

const commonClasses = "absolute top-0 p-2 z-50 m-2"
const iconSize = "w-8 h-8"

const CityAlert = React.lazy(() => import("@/components/popups/city-alert"))
const PetFilter = React.lazy(() => import("@/components/pet-filter"))

export default function Main() {
	// Setups
	const { t } = useTranslation()
	const navigate = useNavigate()
	const isAuthenticated = useIsAuthenticated()
	const authHeader = useAuthHeader()
	const user = useAuthUser<AuthState>()

	// States
	const [allPets, setAllPets] = useState<Pet_Response[]>([])
	const [loadingPets, setLoadingPets] = useState<boolean>(true)
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [page, setPage] = useState<number>(1)
	const [filter, setFilter] = useState<Pet_Filter>(defaultFilterValue)
	const [openAlertCity, setOpenAlertCity] = useState<boolean>(false)
	const [openInstall, setOpenInstall] = useState<boolean>(false)

	// Functions
	const buildQueryString = useCallback(
		(page: number): string => {
			const params = new URLSearchParams(filter as Record<string, string>).toString()
			const paginationParams = `page=${page}&limit=10`
			return `${paginationParams}&${params}`
		},
		[filter?.owner_type, filter?.sex, filter?.sterilized, filter?.type, filter?.weight],
	)

	const filterPets = useCallback(
		(pets: Pet_Response[]) => {
			if (!isAuthenticated) {
				const browserLiked = JSON.parse(localStorage.getItem("_data_offline_liked") || "[]") as string[]
				pets = pets.filter((pet) => !browserLiked.includes(pet._id))
			}
			return pets
		},
		[isAuthenticated, user],
	)

	const addNewPets = useCallback(
		(pets: Pet_Response[]): void => {
			toast({ description: "Pets updated!" })
			const filteredNewPets = pets.filter((pet) => !allPets.find(({ _id }) => _id === pet._id))
			const combinedPets = [...allPets, ...filteredNewPets]
			// This checks if there are new pets to add and combines them with the existing pets.
			setAllPets(combinedPets)
		},
		[allPets, page],
	)

	const fetchPets = (page: number = 1) => {
		setLoadingPets(true)
		const queryString = buildQueryString(page)
		axios
			.get(`${API.baseURL}/pets/recommendations?${queryString}`, { headers: { Authorization: authHeader } })
			.then((res: AxiosResponse) => {
				let newPets: Pet_Response[] = res.data
				newPets = filterPets(newPets)
				addNewPets(newPets)
			})
			.catch(axiosErrorHandler)
			.finally(() => {
				setLoadingPets(false)
			})
	}

	function updateFilter(filter: Pet_Filter) {
		setFilter(() => filter)
	}

	useEffect(() => {
		if (current === allPets.length - 1 && allPets.length % 10 === 0) {
			setPage((prevPage) => prevPage + 1)
			fetchPets(allPets.length / 10 + 1)
			console.log("Fetch more pets")
		}
	}, [current, filter?.owner_type, filter?.sex, filter?.sterilized, filter?.type, filter?.weight])

	useEffect(() => {
		if (api) {
			setCurrent(api.selectedScrollSnap())
			api.on("select", () => setCurrent(api.selectedScrollSnap()))
		}
	}, [api])

	useEffect(() => {
		if (!localStorage.getItem("_city")) {
			setOpenAlertCity(true)
		}
		// @ts-expect-error vite envs
		if (!isPWA() && import.meta.env.MODE === "production") {
			setOpenInstall(true)
		}
		fetchPets()
	}, [])

	return (
		<>
			<PWAInstallComponent icon="images/pete-logo.svg" name="Pete" manifestUrl="/manifest.webmanifest" open={openInstall} />
			{openAlertCity && <CityAlert setOpen={setOpenAlertCity} />}
			<div
				className={cn(commonClasses, "left-0")}
				onClick={() => {
					navigate("/pwa/profile")
				}}>
				<UserRound className={iconSize} />
			</div>
			<PetFilter updateFilter={updateFilter} filter={filter}>
				<Button variant="link" className={cn(commonClasses, "right-0")}>
					<Filter className={iconSize} />
				</Button>
			</PetFilter>
			<div className="flex h-screen w-full flex-col items-center justify-center p-4">
				<div className="max-w-md">
					{loadingPets && <p className="mb-2 w-full animate-pulse rounded-lg border bg-card p-4 font-semibold">{t("label.updatePets")}...</p>}
					{allPets.length > 0 ? (
						<>
							<Carousel setApi={setApi} className="mb-5" opts={{ loop: false }}>
								<CarouselContent>
									{allPets.map((pet) => (
										<CarouselItem key={pet._id}>
											<PetCard {...pet} _id={pet._id} />
										</CarouselItem>
									))}
								</CarouselContent>
							</Carousel>


							<div className="mt-2 flex w-full justify-center gap-2 px-3">
								<Button
									size={"icon"}
									variant={"secondary"}
									className="active:scale-95"
									disabled={allPets[current]._id === allPets[0]._id}
									onClick={() => {
										api?.scrollPrev()
									}}>
									<MoveLeft />
								</Button>
								<Button
									size={"icon"}
									variant={"secondary"}
									className="active:scale-95"
									disabled={allPets[current]._id === allPets[allPets.length - 1]._id}
									onClick={() => {
										api?.scrollNext()
									}}>
									<MoveRight />
								</Button>
							</div>
						</>
					) : (
						<NoMorePets />
					)}
				</div>
			</div>
		</>
	)
}

function NoMorePets() {
	const { t } = useTranslation()
	return (
		<Card className="flex flex-col items-center justify-center p-6 text-center">
			<h1 className="flex items-center gap-2 text-2xl font-bold text-orange-200">
				<LucideDog />
				{t("label.noPets")}
				<LucideCat />
			</h1>
			<p>{t("text.no_more_pets")}</p>
		</Card>
	)
}
