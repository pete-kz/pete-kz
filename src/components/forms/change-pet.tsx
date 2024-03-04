
import React, { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuthUser } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { axiosAuth as axios } from '@utils'
import { notification } from '@utils'
import { API } from '@config'
import LoadingSpinner from '@/components/loading-spinner'
import { Textarea } from '@/components/ui/textarea'
import ReactImageGallery from 'react-image-gallery'
import { Pet_Response } from '@/lib/declarations'


export function ChangePetForm({ petData }: { petData: Pet_Response }) {

    // Setups
    const { t } = useTranslation()
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const formSchema = z.object({
        name: z
            .string()
            .min(2, { message: 'Pets name cant be shorter than 2 characters!' })
            .optional(),
        date: z
            .string()
            .optional(),
        type: z
            .enum(['Cat', 'Dog', 'Other'])
            .optional(),
        description: z
            .string()
            .optional(),
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

    // States
    const [loadingState, setLoadingState] = useState<boolean>(false)
    const [files, setFiles] = useState<undefined | Blob[]>(undefined)
    const [images, setImages] = useState<never[]>([])

    // Functions
    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoadingState(true)
        const formData = new FormData()
        formData.append('name', values.name as string)
        formData.append('age', values.date as string)
        formData.append('description', values.description as string)
        formData.append('type', values.type as string)
        formData.append('userID', user._id)
        formData.append('city', localStorage.getItem('_city') || '0')
        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i])
            }
        }
        notification.custom.promise(
            axios.post(`${API.baseURL}/pets/edit/${petData._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .finally(() => { setLoadingState(false) })
        )
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
                    thumbnail: checkImage(file)
                } as never)
            }
        })
        setImages(imagesObject)
    }, [files])

    useEffect(() => {
        if (petData) {
            form.setValue('name', petData.name)
            form.setValue('description', petData.description)
            form.setValue('date', petData.age)
            form.setValue('type', petData.type)
            setImages(petData.imagesPath.map(imgLink => { return { original: imgLink, thumbnail: imgLink } as never }))
        }
    }, [petData, form])

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
                                    <Input type='date' {...field} />
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
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="picture">{t('pet.add.img')}</label>
                    <Input id="picture" type="file" accept="image/png, image/jpeg, image/jpg"
                        multiple
                        onChange={(event) => {
                            const files = event.target.files ? Array.from(event.target.files) : []
                            setFiles(files)
                        }} />
                </div>
                <Button onClick={() => { console.log(form.formState.errors) }} className='w-full' type="submit">{loadingState ? <LoadingSpinner /> : t('pet.update_btn')}</Button>
            </form>
        </Form>
    )
}