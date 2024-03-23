import { User_Response } from "@/lib/declarations"
import React from "react"
import { Button } from "./ui/button"
import { Instagram, Phone, Send } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function PetOverlayContactSection({ user }: { user: User_Response }) {
	// Setups
	const { t } = useTranslation()

	return (
		<>
			<h3 className="text-2xl font-bold">{t("label.contacts")}</h3>
			<p>{user.firstName + " " + user.lastName}</p>
			{user.social.instagram && (
				<Button
					variant={"link"}
					className="flex gap-2 pl-0"
					onClick={() => {
						window.open(`https://instagram.com/${user.social.instagram}`, "_blank")
					}}>
					<Instagram />
					{user.social.instagram}
				</Button>
			)}
			{user.social.telegram && (
				<Button
					className="flex gap-2 pl-0"
					variant={"link"}
					onClick={() => {
						window.open(`https://t.me/${user.social.telegram}`, "_blank")
					}}>
					<Send />
					{user.social.telegram}
				</Button>
			)}
			{user.phone && (
				<Button
					className="flex gap-2 pl-0"
					variant={"link"}
					onClick={() => {
						window.open(`tel:${user.phone}`, "_blank")
					}}>
					<Phone />
					{user.phone}
				</Button>
			)}
		</>
	)
}
