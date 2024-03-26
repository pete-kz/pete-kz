import React, { useEffect } from "react"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { RegisterForm } from "@/components/forms/register"
import { Helmet } from "react-helmet"
import { motion } from "framer-motion"
import { useNav } from "@/lib/contexts"

export default function Register() {
	// Setups
	const navigate = useNavigate()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()
	const { updateNavText } = useNav()

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/pwa")
		}
		updateNavText(t("label.authorization.register.default"))
	}, [])

	return (
		<motion.div className="flex w-full flex-col gap-2 p-4" key={"register_page"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
			<Helmet>
				<title>{"Pete - " + t("label.authorization.register.default")}</title>
			</Helmet>
			<div className="w-full">
				<h1 className="text-2xl">{t("label.authorization.register.default")}</h1>
				<p className="flex items-center gap-1.5 text-sm">
					{t("label.authorization.or")}{" "}
					<Button
						className="p-0"
						variant={"link"}
						onClick={() => {
							navigate("/auth/login")
						}}>
						{t("label.authorization.register.login")}
					</Button>
				</p>
			</div>
			<RegisterForm />
		</motion.div>
	)
}
