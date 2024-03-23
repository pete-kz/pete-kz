import React from "react"
import { useTranslation } from "react-i18next"
import ChangeLanguage from "@/components/change-language"
import ChangeCity from "@/components/change-city"
import SupportCard from "@/components/cards/support"
import ProjectCard from "@/components/cards/project"
import MobilePageHeader from "@/components/mobile-page-header"
import { Helmet } from "react-helmet"

export default function Settings() {
	// Setups
	const { t } = useTranslation()

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.settings")}</title>
			</Helmet>
			<MobilePageHeader title={t("header.settings")} to="/pwa/profile" />
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
