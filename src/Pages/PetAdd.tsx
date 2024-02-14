/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'

// UI
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/Components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import ImageGallery from 'react-image-gallery'
import { Textarea } from '@/Components/ui/textarea'
import LoadingSpinner from '@/Components/loading-spinner'


export default function AddPetPage() {

    // Setups
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const signout = useSignOut()
    const authHeader = useAuthHeader()
    const { t } = useTranslation()

    // States
    const [name, setName] = useState<string>('')
    const [age, setAge] = useState<string>('')
    const [type, setType] = useState<Pet_Response['type']>('Cat')
    const [description, setDescription] = useState<string>('')
    const [files, setFiles] = useState<undefined | Blob[]>(undefined)
    const [images, setImages] = useState<never[]>([])
    const [uploadState, setUploadState] = useState<boolean>(false)

    // Functions
    function addPet() {
        setUploadState(true)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('age', `${age}`)
        formData.append('description', description)
        formData.append('type', type)
        formData.append('userID', user._id)
        formData.append('city', localStorage.getItem('_city') || '0')
        formData.append('name', name)
        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]) // Use the same field name for each file
            }
        }
        axios.post(`${API.baseURL}/pets/add`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response: AxiosResponse) => {
                if (!response.data.err) {
                    notification.custom.success(t('success.label'))
                } else {
                    notification.custom.error(response.data.err)
                }
                setUploadState(false)
            })
            .catch(err => {
                notification.custom.error(err)
                setUploadState(false)
            })
    }

    function checkToken() {
        const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem('_auth')}`
        const isEqualTokens = authHeader() == token
        if (!isEqualTokens) {
            signout()
        }
    }

    function checkImage(file: Blob | undefined) {
        if (file == undefined) {
            return ''
        }
        return URL.createObjectURL(file)
    }

    // Handlers
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value)
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value)
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/auth/login')
            return
        }
        checkToken()
        // @ts-expect-error because it is imported from the web
        ym(96355513, 'hit', window.origin)
    }, [])

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
        <>
            <m.div className='m-2 p-2 mb-20' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div>
                    <h1 className='text-2xl font-bold'>Adding new pet</h1>
                </div>
                <div className='mb-2'>
                    <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} />
                </div>
                <form onSubmit={addPet} className='gap-2 flex flex-col'>
                    <div className='grid w-full items-center gap-1.5'>
                        <Label htmlFor='pet_name'>{t('pet.name')}*</Label>
                        <Input required value={name} id='pet_name' onChange={handleNameChange} />
                    </div>
                    <div className='grid grid-cols-2 grid-rows-1 gap-2 w-full'>
                        <div className='grid w-full items-center gap-1.5'>
                            <Label>{t('pet.type')}*</Label>
                            <Select required value={type} onValueChange={(value) => {
                                setType(value as 'Cat' | 'Dog' | 'Other')
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('pet.type')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {['Cat', 'Dog', 'Other'].map((typepet) => (
                                        <SelectItem key={typepet} value={typepet}>{t(`pet.types.${['Cat', 'Dog', 'Other'].indexOf(typepet)}`)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='grid w-full items-center gap-1.5'>
                            <Label htmlFor='pet_age'>{t('pet.age')}*</Label>
                            <Input required className='w-full' value={age} defaultValue={0} id='pet_age' onChange={handleAgeChange} type='date' />
                        </div>
                    </div>
                    <div className='grid w-full items-center gap-1.5'>
                        <Label htmlFor='pet_description'>{t('pet.description')}*</Label>
                        <Textarea required value={description} id='pet_description' onChange={handleDescriptionChange} />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="picture">{t('pet.add.img')}*</Label>
                        <Input id="picture" type="file" accept="image/png, image/jpeg, image/jpg"
                            multiple
                            required
                            onChange={(event) => {
                                const files = event.target.files ? Array.from(event.target.files) : []
                                setFiles(files)
                            }} />
                    </div>
                    <Button className='w-full mt-2' disabled={uploadState} type='submit'>{uploadState ? <LoadingSpinner /> : t('pet.add.btn')}</Button>

                </form>

            </m.div>
        </>
    )
}