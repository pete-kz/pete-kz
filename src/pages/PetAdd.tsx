/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import useSignOut from "react-auth-kit/hooks/useSignOut"
import { useTranslation } from "react-i18next"
import { AddPetForm } from "@/components/forms/add-pet"
import MobilePageHeader from "@/components/mobile-page-header"
import { Helmet } from "react-helmet"

export default function AddPetPage() {
	// Setups
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()
	const signout = useSignOut()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()

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
	}, [])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.petAdd")}</title>
			</Helmet>
			<MobilePageHeader title={t("header.petAdd")} to="/pwa/profile" />
			<div className="m-2 mb-20 p-2">
				<AddPetForm />
			</div>
		</>
	)
}
