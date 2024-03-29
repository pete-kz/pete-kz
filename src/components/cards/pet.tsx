/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import type { Pet_Response, User_Response } from "@declarations"
import { formatAge } from "@/lib/utils"
import PetOverlay from "@/components/pet-overlay"

interface PetCard extends Pet_Response {
	user?: User_Response
}

export default function PetCard(props: PetCard) {
	// Setups
	const { t } = useTranslation()

	// States
	const [openPet, setOpenPet] = useState<boolean>(false)

	return (
		props.user && (
			<>
				<PetOverlay pet={props} info contacts open={openPet} setOpen={setOpenPet} />
				<div
					className="relative cursor-pointer"
					style={{
						aspectRatio: "3/4",
						overflow: "hidden",
						minWidth: "100%",
					}}
					onClick={() => {
						setOpenPet(true)
					}}>
					<img
						className="rounded-lg"
						src={props.imagesPath[0]}
						alt={props.name}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
					<div className="from-2% absolute bottom-0 left-0 flex h-full w-full items-end rounded-lg bg-gradient-to-t from-black to-transparent to-40% p-3">
						<div>
							<p className="text-2xl font-bold">{props.name}</p>
							<p>{formatAge(props.birthDate, t("pet.year"), t("pet.month")) as string}</p>
						</div>
					</div>
				</div>
			</>
		)
	)
}
