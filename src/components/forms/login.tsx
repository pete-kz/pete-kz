import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useSignIn from "react-auth-kit/hooks/useSignIn"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios, { AxiosResponse } from "axios"
import { useToast } from "../ui/use-toast"
import { API } from "@config"
import LoadingSpinner from "@/components/loading-spinner"
import { PhoneInput } from "../ui/phone-input"
import { axiosErrorHandler } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

export function LoginForm() {
	// Setups
	const { t } = useTranslation()
	const signIn = useSignIn()
	const { toast } = useToast()
	const navigate = useNavigate()
	const formSchema = z.object({
		phone: z
			.string()
			.min(7, { message: t("notifications.phone_length") })
			.includes("+", { message: t("notifications.phone_international") }),
		password: z.string().min(8, { message: t("notifications.password_length") }),
	})
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			phone: "+7",
			password: "",
		},
	})

	// States
	const [loadingState, setLoadingState] = useState<boolean>(false)

	// Functions
	function onSubmit(values: z.infer<typeof formSchema>) {
		setLoadingState(true)
		axios
			.post(`${API.baseURL}/auth/login`, {
				phone: values.phone,
				password: values.password,
			})
			.then((response: AxiosResponse) => {
				if (
					signIn({
						auth: {
							token: response.data.token,
							type: "Bearer",
						},
						refresh: response.data.refreshToken,
						userState: response.data.docs,
					})
				) {
					navigate("/pwa")
				} else {
					toast({ description: t("notifications.internal_error") })
				}
				setLoadingState(false)
			})
			.catch(axiosErrorHandler)
			.finally(() => setLoadingState(false))
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("user.phone")}</FormLabel>
							<FormControl>
								<PhoneInput defaultCountry="KZ" placeholder={t("user.phone")} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("user.password")}</FormLabel>
							<FormControl>
								<Input placeholder="" type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" type="submit">
					{loadingState ? <LoadingSpinner /> : t("button.login")}
				</Button>
			</form>
		</Form>
	)
}
