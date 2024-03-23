import React from "react"
import { Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { Label } from "./ui/label"

export function ModeToggle() {
	// Setups
	const { setTheme } = useTheme()
	const { t } = useTranslation()

	return (
		<div className="grid h-fit w-fit items-center gap-1.5">
			<Label className="text-ellipsis">{t("label.mode.default")}</Label>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon">
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setTheme("light")}>{t("label.mode.light")}</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("dark")}>{t("label.mode.dark")}</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("system")}>{t("label.mode.system")}</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
