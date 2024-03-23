/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useTranslation } from "react-i18next"

const ChangeCity = React.lazy(() => import("@/components/change-city"))

export default function CityAlert({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
	// Setups
	const { t } = useTranslation()

	return (
		<AlertDialog defaultOpen>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("warning.city.title")}</AlertDialogTitle>
					<AlertDialogDescription>{t("warning.city.description")}</AlertDialogDescription>
				</AlertDialogHeader>
				<ChangeCity />
				<AlertDialogFooter>
					<AlertDialogAction
						onClick={() => {
							setOpen(false)
						}}>
						{t("warning.city.confirm")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
