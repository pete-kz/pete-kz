import React, { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useAuthUser } from 'react-auth-kit'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AxiosResponse } from 'axios'
import { notification, axiosAuth as axios } from '@utils'
import { API } from '@config'
import LoadingSpinner from '@/components/loading-spinner'
import { User_Response } from '@/lib/declarations'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { InputIcon } from '../ui/input-icon'

export function ChangeProfileForm() {

    // Setups
    const { t } = useTranslation()
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}

    // States
    const [loadingState, setLoadingState] = useState<boolean>(false)
    const [userData, setUserData] = useState<User_Response>()
    const [updated, setUpdated] = useState<boolean>(false)

    // Form Setups
    const formSchema = z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        phone: z.string().min(7, { message: t('errors.phone_length') }).includes('+', { message: t('errors.phone_international') }),
        instagram: z.union([z.string(), z.string().min(2)]).optional().transform(e => e === '' ? undefined : e),
        telegram: z.union([z.string(), z.string().min(2)]).optional().transform(e => e === '' ? undefined : e),
        password: z.union([z.string(), z.string().min(4)]).optional().transform(e => e === '' ? undefined : e)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: userData?.name.split(' ')[0],
            lastName: userData?.name.split(' ').filter(word => word != userData.name.split(' ')[0]).join(' '),
            phone: userData?.phone,
            instagram: userData?.social.instagram,
            telegram: userData?.social.telegram,
            password: ''
        },
    })

    // Functions
    function getUserInfo() {
        setLoadingState(true)
        axios.post(`${API.baseURL}/users/find`, { query: { _id: user._id } }).then((res: AxiosResponse) => {
            // need to populate skipped and like => filter out all pets based on skipped ids
            if (!res.data.err) {
                const user: User_Response = res.data
                setUserData(user)
                setLoadingState(false)
            } else {
                notification.custom.error(res.data.err)
                setLoadingState(false)
            }
        })
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoadingState(true)
        axios.post(`${API.baseURL}/users/update/${user._id}`, {
            update: {
                name: `${values.firstName} ${values.lastName}`,
                phone: values.phone,
                password: values.password,
                social: {
                    instagram: values.instagram,
                    telegram: values.telegram
                }
            }
        })
            .then((res: AxiosResponse) => {
                if (!res.data.err) {
                    notification.custom.success(t('user.profile_updated'))
                    setUpdated(update => !update)
                } else {
                    notification.custom.error(res.data.err)
                }
                setLoadingState(false)
            })
    }

    useEffect(() => {
        getUserInfo()
    }, [updated])

    useEffect(() => {
        if (userData) {
            form.setValue('firstName', userData.name.split(' ')[0])
            form.setValue('lastName', userData?.name.split(' ').filter(word => word != userData.name.split(' ')[0]).join(' '))
            form.setValue('instagram', userData.social.instagram)
            form.setValue('telegram', userData.social.telegram)
            form.setValue('phone', userData.phone)
        }
    }, [userData, form])

    return (
        // user.name, user.login, user.phone, user.contacts.instagram, user.contacts.telegram, user.password
        <Dialog>
            <DialogTrigger asChild>
                <Button>{t('user.update_profile')}</Button>
            </DialogTrigger>
            <DialogContent className='rounded-lg'>
                <DialogHeader className='text-left'>
                    <DialogTitle>{t('user.update_profile')}</DialogTitle>
                    {/* <DialogDescription>Here</DialogDescription> */}
                </DialogHeader>
                {userData?._id && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
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
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('user.contacts.phone')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+7 123 456 78 90" type='tel' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="instagram"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('user.contacts.instagram')}</FormLabel>
                                        <FormControl>
                                            <InputIcon icon={<span className='text-muted'>instagram.com/</span>} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telegram"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('user.contacts.telegram')}</FormLabel>
                                        <FormControl>
                                            <InputIcon icon={<span className='text-muted'>t.me/</span>} {...field} />
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
                                        <FormLabel>{t('user.password')}</FormLabel>
                                        <FormControl>
                                            <Input type='password' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button className='w-full' type="submit">{loadingState ? <LoadingSpinner /> : t('pet.update_btn')}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>

    )
}
