import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSignIn } from 'react-auth-kit'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/Components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/ui/form'
import { Input } from '@/Components/ui/input'
import axios, { AxiosResponse } from 'axios'
import { notification } from '@utils'
import { API } from '@config'
import LoadingSpinner from '@/Components/loading-spinner'

export function LoginForm() {
    // Setups
    const { t } = useTranslation()
    const signIn = useSignIn()

    // States
    const [loadingState, setLoadingState] = useState<boolean>(false)

    const formSchema = z.object({
        phone: z.string().min(7, { message: t('errors.phone_length') }).includes('+', { message: t('errors.phone_international') }),
        password: z.string().min(8, { message: t('errors.password_length') })
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: '+7',
            password: ''
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setLoadingState(true)
        axios.post(`${API.baseURL}/users/login`, values).then((response: AxiosResponse) => {
            if (!response.data.err) {
                if (signIn({
                    token: response.data.token,
                    expiresIn: response.data.expiresIn,
                    tokenType: 'Bearer',
                    authState: response.data.docs,
                })) {
                    location.reload()
                } else {
                    notification.custom.error(t('errors.internal_error'))
                }
            } else {
                const error = response.data.err
                notification.custom.error(error)
            }
            setLoadingState(false)
        }).catch(() => {
            notification.custom.error(t('errors.too_many_request'))
            setLoadingState(false)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('login.labels.1')}</FormLabel>
                            <FormControl>
                                <Input placeholder="+7 123 456 78 90" type='tel' {...field} />
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
                            <FormLabel>{t('login.labels.0')}</FormLabel>
                            <FormControl>
                                <Input placeholder="" type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='w-full' type="submit">{loadingState ? <LoadingSpinner /> : t('login.button')}</Button>
            </form>
        </Form>
    )
}
