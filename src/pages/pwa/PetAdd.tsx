/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import useSignOut from "react-auth-kit/hooks/useSignOut"
import { useTranslation } from "react-i18next"
import { AddPetForm } from "@/components/forms/add-pet"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"

export default function AddPetPage() {
	// Setups
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()
	const signout = useSignOut()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()
	const { updateNavText } = useNav()

	// Functions
	function checkToken() {
		const token = `${localStorage.getItem("_auth_type")} ${localStorage.getItem("_auth")}`
		const isEqualTokens = authHeader == token
		if (!isEqualTokens) {
			signout()
		}
	}

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate("/auth/login")
			return
		}
		checkToken()
		updateNavText(t("header.petAdd"))
	}, [])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.petAdd")}</title>
			</Helmet>
			<div className="m-2 mb-20 p-2">
				<AddPetForm />
			</div>
		</>
	)
}
