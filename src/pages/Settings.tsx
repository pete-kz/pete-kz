import React from "react"
import { useTranslation } from "react-i18next"
import ChangeLanguage from "@/components/change-language"
import ChangeCity from "@/components/change-city"
import SupportCard from "@/components/cards/support"
import ProjectCard from "@/components/cards/project"
import MobilePageHeader from "@/components/mobile-page-header"

export default function Settings() {
	// Setups
	const { t } = useTranslation()

	return (
		<>
			<MobilePageHeader title={t("header.settings")} to="/pwa/profile" />
			<div className="grid p-4 gap-2">
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
