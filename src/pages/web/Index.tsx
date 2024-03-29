import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import ChangeLanguage from "@/components/change-language"
import { Card } from "@/components/ui/card"
import { useQuery } from "@/lib/utils"
import PWAInstallComponent from "@/components/pwa-install"
export default function IndexPage() {
	// Setups
	const navigate = useNavigate()
	const { t } = useTranslation()
	const query = useQuery()

	// States
	const [showHowToInstall, setShowHowToInstall] = React.useState(false)

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
		<div className="flex flex-col gap-3">
			<Card className="flex w-full flex-col items-center justify-center p-3">
				<div className="flex flex-col">
					<img loading="lazy" src="/images/repository-open-graph-russian.png" />
					<div className="mx-auto grid items-center gap-1.5">
						<ChangeLanguage label={false} />
						<div className="flex gap-1.5">
							<Button variant={"outline"} onClick={go}>
								{t("label.web")}
							</Button>
							<Button
								onClick={() => {
									setShowHowToInstall(() => true)
								}}>
								{t("label.install")}
							</Button>
						</div>
					</div>
				</div>
			</Card>
			<PWAInstallComponent manualApple icon="images/pete-logo.svg" name="Pete" manifestUrl="/manifest.webmanifest" open={showHowToInstall} />
		</div>
	)
}
