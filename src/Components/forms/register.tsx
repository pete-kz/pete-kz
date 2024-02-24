import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios, { AxiosResponse } from 'axios'
import { notification } from '@utils'
import { API } from '@config'
import LoadingSpinner from '@/components/loading-spinner'

export function RegisterForm() {

    // Setups
    const { t } = useTranslation()
    const navigate = useNavigate()
    const formSchema = z.object({
        firstName: z.string().min(1, { message: t('errors.firstName_req') }).optional(),
        lastName: z.string().min(1, { message: t('errors.lastName_req') }).optional(),
        phone: z.string().min(7, { message: t('errors.phone_length') }).includes('+', { message: t('errors.phone_international') }),
        password: z.string().min(8, { message: t('errors.password_length') }),
        name: z.string().optional()
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: '+7',
            password: '',
            firstName: '',
            lastName: '',
        },
    })

    // States
    const [loadingState, setLoadingState] = useState<boolean>(false)

    // Functions
    function onSubmit(values: z.infer<typeof formSchema>) {
        values.name = values.firstName + ' ' + values.lastName
        values.firstName = undefined
        values.lastName = undefined
        setLoadingState(true)
        axios.post(`${API.baseURL}/users/register`, values).then((response: AxiosResponse) => {
            if (!response.data.err) {
                navigate('/auth/login')
            } else {
                notification.custom.error(response.data.err)
            }
            setLoadingState(false)
            return
        }).catch(() => {
            notification.custom.error(t('errors.too_many_requests'))
            setLoadingState(false)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full md:w-1/3">
                <div className='flex gap-1.5'>
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('register.labels.0')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('register.labels.1')}</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('register.labels.2')}</FormLabel>
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
                            <FormLabel>{t('register.labels.3')}</FormLabel>
                            <FormControl>
                                <Input placeholder="" type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='w-full' type="submit">{loadingState ? <LoadingSpinner /> : t('register.button')}</Button>
            </form>
        </Form>
    )
}
