import React from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function MobilePageHeader({ title, to }: { title: string; to: string }) {
	// Setups
	const navigate = useNavigate()
	const { t } = useTranslation()

	return (
		<div className="grid h-16 w-full grid-cols-3 grid-rows-1 bg-card">
			<div className="flex items-center justify-start pl-2">
				<Button
					variant={"link"}
					onClick={() => {
						navigate(to)
					}}
					className="flex h-fit justify-start gap-1 p-4 pl-0 text-muted-foreground">
					<div className="flex items-center">
						<ChevronLeft />
						{t("label.back")}
					</div>
				</Button>
			</div>
			<div className="flex items-center justify-center overflow-visible text-ellipsis text-2xl font-bold">{title}</div>
			<div className="w-full"></div>
		</div>
	)
}
