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
        name: z.string().min(2, { message: 'Pets name cant be shorter than 2 characters!' }),
        age: z.string(),
        type: z.enum(['Cat', 'Dog', 'Other']),
        files: z.array(z.instanceof(File))
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            age: '',
            type: 'Cat'
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                <FormField
                    control={form.control}
                    name="name"
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
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('pet.type')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='w-full' type="submit">{loadingState ? <LoadingSpinner /> : t('login.button')}</Button>
            </form>
        </Form>
    )
}
