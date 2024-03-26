import React from "react"
import { useTranslation } from "react-i18next"
import { User_Response } from "@declarations"
import { Card } from "@/components/ui/card"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { parseMongoDate } from "@/lib/utils"

export default function UserProfileCard({ user }: { user: User_Response }) {
	// Setups
	const { t } = useTranslation()

	// Functions
	const userLastUpdated = () => {
		if (!user) return ""
		const parsedDate = parseMongoDate(user.updatedAt)
		return parsedDate ? `${parsedDate.date.day}/${parsedDate.date.month}/${parsedDate.date.year} ${parsedDate.time.hour}:${parsedDate.time.minutes}` : ""
	}

	return (
		<Card className="flex flex-col gap-4 p-3">
			<div className="flex gap-2">
				<Avatar>
					<AvatarImage src={"/images/pete-logo.svg"} alt={"PETE"} />
					<AvatarFallback>P</AvatarFallback>
				</Avatar>
				<div>
					<p className="font-bold">{user.companyName ? user.companyName : `${user.firstName} ${user.lastName}`}</p>
					<p className="">{`${t("label.lastUpdated")}: ${userLastUpdated()}`}</p>
				</div>
			</div>
		</Card>
	)
}
