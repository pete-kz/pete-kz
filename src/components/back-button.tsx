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
		<div className={cn("flex h-fit justify-start gap-1 p-4 pl-0", className)}>
			<Button
				variant={"link"}
				type="button"
				className="m-0 grid gap-1.5 p-0 text-muted-foreground"
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
