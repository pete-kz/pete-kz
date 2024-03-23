import React from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { HeartOff } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function RemoveLikeAlert({ onClick }: { onClick: () => void }) {
	// Setups
	const { t } = useTranslation()

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"ghost"}>
					<HeartOff size="20" style={{ color: "#FF0000" }} />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("alert.you_sure")}</AlertDialogTitle>
					<AlertDialogDescription>{t("alert.remove_like")}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("alert.back")}</AlertDialogCancel>
					<AlertDialogAction onClick={onClick}>{t("alert.sure")}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
