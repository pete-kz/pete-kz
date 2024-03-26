import React, { lazy, useMemo } from "react"
import useSignOut from "react-auth-kit/hooks/useSignOut"
import { useTranslation } from "react-i18next"
import { AuthState, User_Response } from "@declarations"
import { useNavigate } from "react-router-dom"
import { Pencil, LogOut } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { axiosErrorHandler, parseMongoDate } from "@/lib/utils"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { API } from "@config"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"

const ChangeProfileForm = lazy(() => import("@/components/forms/change-profile"))

export default function UserProfileCard() {
	// Setups
	const { t } = useTranslation()
	const navigate = useNavigate()
	const signout = useSignOut()
	const authState = useAuthUser<AuthState>()
	const authHeader = useAuthHeader()
	const {
		data: user,
		isPending: userPending,
	} = useQuery<User_Response>({
		queryKey: ["me"],
		queryFn: () => axios.get(`${API.baseURL}/me`, { headers: { Authorization: authHeader } }).then((res) => res.data).catch(axiosErrorHandler),
	})

	// Functions
	const userLastUpdated = useMemo(() => {
		if (!user) return ""
		const parsedDate = parseMongoDate(user.updatedAt)
		return parsedDate ? `${parsedDate.date.day}/${parsedDate.date.month}/${parsedDate.date.year} ${parsedDate.time.hour}:${parsedDate.time.minutes}` : ""
	}, [user])

	return (
		<>	
			{userPending && <div>Loading...</div>}
			{user && (
				<Card className="flex flex-col gap-4 p-3">
					<div className="flex gap-2">
						<Avatar>
							<AvatarImage src={"/images/pete-logo.svg"} alt={"PETE"} />
							<AvatarFallback>P</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-bold">{user.companyName ? user.companyName : `${user.firstName} ${user.lastName}`}</p>
							<p className="">{`${t("label.lastUpdated")}: ${userLastUpdated}`}</p>
						</div>
					</div>
					{authState && authState?._id === user._id && (
						<div className="grid grid-cols-2 grid-rows-1 rounded-lg border">
							<ChangeProfileForm>
								<Button className="m-0 gap-2 rounded-none rounded-l-lg border-r p-2" type="submit" variant={"link"}>
									{t("label.edit")}
									<Pencil />
								</Button>
							</ChangeProfileForm>
							<Button
								variant={"link"}
								className="m-0 gap-2 rounded-none rounded-r-lg border-l p-2 text-red-500 hover:rounded-r-lg hover:bg-red-500 hover:text-white"
								onClick={() => {
									signout()
									navigate("/pwa")
								}}>
								{t("label.logout")}
								<LogOut />
							</Button>
						</div>
					)}
				</Card>
			)}
		</>
	)
}
