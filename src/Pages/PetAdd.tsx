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
import { Button, TextField } from '@mui/material'
import { ImageOutlined } from '@mui/icons-material'
import { Select, type SelectChangeEvent, InputLabel, MenuItem, FormControl } from '@mui/material'

import { themeColor } from '@/Utils/colors'
import ImageGallery from 'react-image-gallery'


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
    const [uploadingState, setUploadingState] = useState<boolean>(false)
    const [files, setFiles] = useState<undefined | Blob[]>(undefined)
    const [images, setImages] = useState<any[]>([])

    // Functions
    function addPet() {
        setUploadingState(true)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('age', age)
        formData.append('description', description)
        formData.append('type', type)
        formData.append('userID', user._id)
        formData.append('city', localStorage.getItem('_city') || 'Almaty')
        formData.append('name', name)
        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]) // Use the same field name for each file
            }
        }
        console.log(formData.get('name'), formData.getAll('images'))
        axios.post(`${API.baseURL}/pets/add`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response: AxiosResponse) => {
                if (!response.data.err) {
                    notification.custom.success('Success!')
                } else {
                    notification.custom.error(response.data.err)
                }
            })
        setUploadingState(false)
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

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login')
            return
        }
        checkToken()
    }, [])

    useEffect(() => {
        const imagesObject: React.SetStateAction<any[]> = []
        files?.map(file => {
            if (checkImage(file) != '') {
                imagesObject.push({
                    original: checkImage(file),
                    thumbnain: checkImage(file)
                }) 
            }
        })
        
        setImages(imagesObject)
    }, [files])


    return (
        <>
            <m.div className='m-2 p-2 mb-20' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className='mb-2'>
                    <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} />
                </div>
                <div className='gap-2 flex flex-col'>
                    <div className='flex gap-2 w-full'>
                        <TextField defaultValue={name} fullWidth label={t('pet.name')} variant="outlined" onChange={handleNameChange} />
                        <TextField defaultValue={age} label={t('pet.age')} style={{ width: 60 }} variant="outlined" onChange={handleAgeChange} type='number' />
                    </div>
                    <FormControl fullWidth>
							<InputLabel className="flex justify-center items-center">
								{t('pet.type')}
							</InputLabel>
							<Select
								value={type}
								label={t('pet.type')}
								className="rounded-3xl"
								onChange={(event: SelectChangeEvent) => {
									setType(event.target.value as 'Cat' | 'Dog' | 'Other')
								}}>
								{['Cat', 'Dog', 'Other'].map((typepet) => (
									<MenuItem key={typepet} value={typepet}>{typepet}</MenuItem>
								))}
							</Select>
						</FormControl>
                    <TextField defaultValue={description} label={t('pet.description')} variant="outlined" onChange={handleDescriptionChange} multiline />
                    <Button
                        variant="outlined"
                        className='w-full font-semibold'
                        sx={{ border: `1px solid ${themeColor.iconButtonColor}` }}
                        component="label"
                    >
                        <ImageOutlined sx={{ marginRight: 0.3 }} />
                        <p className="text-xs w-min mr-1">
                            {t('pet.add.img')}
                        </p>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            multiple
                            onChange={(event) => {
                                const files = event.target.files ? Array.from(event.target.files) : []
                                setFiles(files)
                            }}
                            hidden
                        />
                    </Button>
                </div>
                <Button className='w-full' style={{ marginTop: 10 }} disabled={uploadingState} variant='contained' onClick={addPet}>{t('pet.add.btn')}</Button>
            </m.div>
        </>
    )
}