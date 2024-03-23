import React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function AddPetCard() {
	// Setups
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<Card
			className="flex cursor-pointer flex-col items-center justify-center gap-3 p-3"
			onClick={() => {
				navigate("/pwa/pets/add")
			}}>
			<div className="text-zinc-400">
				<Plus fontSize="large" />
			</div>
			<div className="text-center">
				<p>{t("pet.add.btn")}</p>
			</div>
		</Card>
	)
}
