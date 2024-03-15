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
import { axiosErrorHandler, filterValues, } from '@utils'
import { API } from '@config'
import LoadingSpinner from '@/components/loading-spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { useToast } from '../ui/use-toast'
import { PhoneInput } from '../ui/phone-input'

export function RegisterForm() {

    // Setups
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { toast } = useToast()
    const formSchema = z.object({
        firstName: z.string().min(1, { message: t('notifications.firstName_req') }).optional(),
        lastName: z.string().min(1, { message: t('notifications.lastName_req') }).optional(),
        phone: z.string().min(7, { message: t('notifications.phone_length') }).includes('+', { message: t('notifications.phone_international') }),
        type: z.enum(['private', 'shelter', 'breeder', 'nursery']),
        password: z.string().min(8, { message: t('notifications.password_length') }),
        password_repeat: z.string().min(8),
        company_name: z.string().optional()
    }).superRefine(({ password_repeat, password }, ctx) => {
        if (password_repeat !== password) {
          ctx.addIssue({
            code: 'custom',
            message: t('notifications.passwordNoMatch')
          })
        }
      })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: '+7',
            password: '',
            password_repeat: '',
            firstName: '',
            lastName: '',
            company_name: '',
            type: 'private'
        },
    })

    // States
    const [loadingState, setLoadingState] = useState<boolean>(false)
    const [company, setCompany] = useState<boolean>()

    // Functions
    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoadingState(true)
        axios.post(`${API.baseURL}/users/register`, values).then((response: AxiosResponse) => {
            if (!response.data.err) {
                navigate('/auth/login')
            } else {
                toast({ description: response.data.err })
            }
            setLoadingState(false)
            return
        }).catch(axiosErrorHandler)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                <div className='w-full flex gap-1.5'>
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>{t('user.firstName')}</FormLabel>
                                <FormControl>
                                    <Input className='w-full' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>{t('user.lastName')}</FormLabel>
                                <FormControl>
                                    <Input className='w-full'  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                    <Checkbox className='h-6 w-6 rounded-full' id="company_checkbox" checked={company} onCheckedChange={(value) => {
                        setCompany(value !== 'indeterminate' ? value : false)
                    }} />
                    <Label htmlFor="company_checkbox">
                        {t('label.question.company')}
                    </Label>
                </div>
                {company && (
                    <FormField
                        control={form.control}
                        name="company_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('user.companyName')}</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.phone')}</FormLabel>
                            <FormControl>
                                <PhoneInput defaultCountry='KZ' placeholder={t('user.phone')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.type.default')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={'-'} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filterValues.owner_type.map((ownerType) => (
                                        <SelectItem key={ownerType} value={ownerType}>
                                            {t(`user.type.${ownerType}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                <Input placeholder="" type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password_repeat"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.passwordConfirm')}</FormLabel>
                            <FormControl>
                                <Input placeholder="" type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='w-full' type="submit">{loadingState ? <LoadingSpinner /> : t('button.register')}</Button>
            </form>
        </Form>
    )
}
