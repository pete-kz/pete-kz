import React, { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from 'react-auth-kit'
import { Button } from '@/Components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Input } from '@/Components/ui/input'
import axios, { AxiosResponse } from 'axios'
import { notification } from '@utils'
import { API } from '@config'
import LoadingSpinner from '@/Components/loading-spinner'
import { Textarea } from '@/Components/ui/textarea'
import ReactImageGallery from 'react-image-gallery'


export function AddPetForm() {
    // Setups
    const { t } = useTranslation()
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}

    // States
    const [loadingState, setLoadingState] = useState<boolean>(false)
    const [files, setFiles] = useState<undefined | Blob[]>(undefined)
    const [images, setImages] = useState<never[]>([])

    const formSchema = z.object({
        name: z
            .string()
            .min(2, { message: 'Pets name cant be shorter than 2 characters!' }),
        date: z
            .string(),
        type: z
            .enum(['Cat', 'Dog', 'Other']),
        description: z
            .string({ required_error: 'Description is required!' }),
        files: z
            .instanceof(FileList)
            .refine((val) => val.length > 0, 'File is required'),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            date: '',
            type: 'Cat',
            description: ''
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoadingState(true)
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('age', `${values.date}`)
        formData.append('description', values.description)
        formData.append('type', values.type)
        formData.append('userID', user._id)
        formData.append('city', localStorage.getItem('_city') || '0')
        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i])
            }
        }
        axios.post(`${API.baseURL}/pets/add`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response: AxiosResponse) => {
                if (!response.data.err) {
                    notification.custom.success(t('success.label'))
                } else {
                    notification.custom.error(response.data.err)
                }
                setLoadingState(false)
            })
            .catch(err => {
                notification.custom.error(err)
                setLoadingState(false)
            })
    }

    function checkImage(file: Blob | undefined) {
        if (file == undefined) {
            return ''
        }
        return URL.createObjectURL(file)
    }

    useEffect(() => {
        const imagesObject: React.SetStateAction<never[]> = []
        files?.map(file => {
            if (checkImage(file) != '') {
                imagesObject.push({
                    original: checkImage(file),
                    thumbnain: checkImage(file)
                } as never)
            }
        })
        setImages(imagesObject)
    }, [files])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                <div className='mb-2'>
                    <ReactImageGallery items={images} showFullscreenButton={false} showPlayButton={false} />
                </div>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('pet.name')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='grid grid-rows-1 grid-cols-2 gap-1.5'>
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('pet.type')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('pet.type')} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {['Cat', 'Dog', 'Other'].map((typepet) => (
                                            <SelectItem key={typepet} value={typepet}>{t(`pet.types.${['Cat', 'Dog', 'Other'].indexOf(typepet)}`)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('pet.date')}</FormLabel>
                                <FormControl>
                                    <Input type='date' required {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('pet.description')}</FormLabel>
                            <FormControl>
                                <Textarea required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="picture">{t('pet.add.img')}</label>
                    <Input id="picture" type="file" accept="image/png, image/jpeg, image/jpg"
                        multiple
                        required
                        onChange={(event) => {
                            const files = event.target.files ? Array.from(event.target.files) : []
                            setFiles(files)
                        }} />
                </div>
                <Button className='w-full' type="submit">{loadingState ? <LoadingSpinner /> : t('pet.add.btn')}</Button>
            </form>
        </Form>
    )
}