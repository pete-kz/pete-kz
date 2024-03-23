import React from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

export default function BackButton({ to = "/pwa", action, className }: { to?: string; action?: () => void; className?: string }) {
	// Setups
	const navigate = useNavigate()
	const { t } = useTranslation()

	return (
		<div className={cn("flex justify-start gap-1 h-fit p-4 pl-0", className)}>
			<Button
				variant={"link"}
				type="button"
				className="grid gap-1.5 text-muted-foreground p-0 m-0"
				onClick={() => {
					action ? action() : navigate(to)
				}}>
				<div className="flex items-center">
					<ChevronLeft />
					{t("label.back")}
				</div>
			</Button>
		</div>
	)
}
