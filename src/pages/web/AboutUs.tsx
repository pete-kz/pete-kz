import React from "react"
import AboutUsCard from "@/components/cards/about-us"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"

export default function AboutUsPage() {
	// Setups
	const { t } = useTranslation()

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("label.aboutUs")}</title>
			</Helmet>
			<AboutUsCard />
		</>
	)
}
