/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@config"
import { User_Response, Pet_Filter } from "@declarations"
import { axiosAuth as axios, cn, defaultFilterValue, axiosErrorHandler } from "@utils"
import { AxiosResponse } from "axios"
import { useNavigate } from "react-router-dom"
import { LucideCat, LucideDog, MoveLeft, MoveRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/loading-spinner"
import { CarouselItem, Carousel, CarouselContent, CarouselApi } from "@/components/ui/carousel"
import { Filter, UserRound } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useGetReccommendations } from "@/lib/hooks"

const commonClasses = "absolute top-0 p-2 z-50 m-2"
const iconSize = "w-8 h-8"

const CityAlert = React.lazy(() => import("@/components/popups/city-alert"))
const PetFilter = React.lazy(() => import("@/components/pet-filter"))
const PetCard = React.lazy(() => import("@/components/cards/pet"))

export default function Main() {
	// Setups
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { toast } = useToast()

	// States
	const [allUsers, setAllUsers] = useState<User_Response[]>([])
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [page, setPage] = useState<number>(1)
	const [filter, setFilter] = useState<Pet_Filter>(defaultFilterValue)
	const [openAlertCity, setOpenAlertCity] = useState<boolean>(false)

	const { data: allPets, loading: loadingPets, updatingCache } = useGetReccommendations(page, filter)

	// Functions
	function fetchAllUsers() {
		axios
			.get(`${API.baseURL}/users/find`)
			.then((res: AxiosResponse) => {
				if (res.data.err) {
					return toast({ description: res.data.err })
				}
				setAllUsers(res.data)
			})
			.catch(axiosErrorHandler)
	}

	function updateFilter(filter: Pet_Filter) {
		setFilter(() => filter)
	}

	useEffect(() => {
		if (current === allPets.length - 1 && allPets.length % 10 === 0) {
			setPage(prevPage => prevPage + 1)
		}
	}, [current])

	useEffect(() => {
		if (api) {
			setCurrent(api.selectedScrollSnap())
			api.on("select", () => setCurrent(api.selectedScrollSnap()))
		}
	}, [api])

	useEffect(() => {
		if (localStorage.getItem("_city")) {
			fetchAllUsers()
		} else {
			setOpenAlertCity(true)
		}
	}, [])

	return (
		<>
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
					{updatingCache && !loadingPets && <p className="mb-2 w-full animate-pulse rounded-lg border bg-card p-4 font-semibold">{t("label.updatePets")}...</p>}
					{loadingPets ? (
						<LoadingSpinner size={12} />
					) : allPets.length > 0 ? (
						<>
							<Carousel setApi={setApi} className="mb-5" opts={{ loop: false }}>
								<CarouselContent>
									{typeof allUsers.filter === "function" &&
										allPets.map((pet) => (
											<CarouselItem key={pet._id}>
												<PetCard {...pet} _id={pet._id} user={allUsers.filter((user) => user._id === pet.ownerID)[0]} />
											</CarouselItem>
										))}
								</CarouselContent>
							</Carousel>
							{typeof allUsers.filter === "function" && (
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
							)}
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
