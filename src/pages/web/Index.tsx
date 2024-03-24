import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import ChangeLanguage from "@/components/change-language"
import { Card } from "@/components/ui/card"
import { useQuery } from "@/lib/utils"

export default function IndexPage() {
	// Setups
	const navigate = useNavigate()
	const { t } = useTranslation()
	const query = useQuery()

	// Functions
	function go() {
		navigate("/pwa")
	}

	useEffect(() => {
		if (query.get("pwa") === "true") {
			navigate("/pwa")
		}
	}, [])

	return (
		<Card className="flex w-full flex-col items-center justify-center p-3">
			<div className="flex flex-col">
				<img loading="lazy" src="/images/repository-open-graph-russian.png" />
				<div className="mx-auto flex items-center gap-1.5">
					<ChangeLanguage label={false} />
					<Button onClick={go}>{t("label.proceedPWA")}</Button>
				</div>
			</div>
		</Card>
	)
}
