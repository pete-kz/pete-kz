import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/forms/login"
import { Helmet } from "react-helmet"
import { motion } from "framer-motion"
import { useNav } from "@/lib/contexts"

export default function Login() {
	// Setups
	const navigate = useNavigate()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()
	const { updateNavText } = useNav()

	useEffect(() => {
		if (isAuthenticated()) {
			navigate("/pwa")
		}
		updateNavText(t("label.authorization.login.default"))
	}, [])

	return (
		<motion.div className="flex w-full flex-col gap-2 p-4" key={"login_page"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
			<Helmet>
				<title>{"Pete - " + t("label.authorization.login.default")}</title>
			</Helmet>
			<div>
				<h1 className="text-2xl">{t("label.authorization.login.default")}</h1>
				<p className="flex items-center gap-1.5 text-sm">
					{t("label.authorization.or")}{" "}
					<Button
						className="p-0"
						variant={"link"}
						onClick={() => {
							navigate("/auth/register")
						}}>
						{t("label.authorization.login.register")}
					</Button>
				</p>
			</div>
			<LoginForm />
		</motion.div>
	)
}
