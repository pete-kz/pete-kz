import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import ChangeLanguage from "@/components/change-language"
import ChangeCity from "@/components/change-city"
import SupportCard from "@/components/cards/support"
import ProjectCard from "@/components/cards/project"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"

export default function Settings() {
	// Setups
	const { t } = useTranslation()
	const { updateNavText } = useNav()

	useEffect(() => {
		updateNavText(t("header.settings"))
	}, [])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.settings")}</title>
			</Helmet>
			<div className="grid gap-2 p-4">
				<ProjectCard social />
				<SupportCard />
				<ChangeCity />
				<div>
					<ChangeLanguage />
				</div>
			</div>
		</>
	)
}
