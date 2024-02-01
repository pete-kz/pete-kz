/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification, useQuery } from '@utils'
import { AxiosResponse } from 'axios'
import { Button, TextField, IconButton } from '@mui/material'
import { Favorite, ImageOutlined, KeyboardReturn } from '@mui/icons-material'
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
    const [ownerData, setOwnerData] = useState<User_Response>()
    const [name, setName] = useState<string>('')
    const [age, setAge] = useState<string>('')
    const [type, setType] = useState<Pet_Response['type']>('Cat')
    const [description, setDescription] = useState<string>('')
    const [location, setLocation] = useState<string>('')
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
        formData.append('city', location)
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
        // axios.post(`${API.baseURL}/pets/add`).then((res: AxiosResponse) => {
        //     if (!res.data.err) {

        //     } else {
        //         notification.custom.error(res.data.err)
        //     }
        // })
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
                        <TextField defaultValue={name} fullWidth label={'Name'} variant="outlined" onChange={handleNameChange} />
                        <TextField defaultValue={age} label={'Age'} style={{ width: 60 }} variant="outlined" onChange={handleAgeChange} type='number' />
                    </div>
                    
                    <TextField defaultValue={description} label={'Description'} variant="outlined" onChange={handleDescriptionChange} multiline />
                    <Button
                        variant="outlined"
                        className='w-full font-semibold'
                        sx={{ border: `1px solid ${themeColor.iconButtonColor}` }}
                        component="label"
                    >
                        <ImageOutlined sx={{ marginRight: 0.3 }} />
                        <p className="text-xs w-min mr-1">
                            {t('request.buttons.img.label')}
                            {' '}
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
                <Button className='w-full' style={{ marginTop: 10 }} disabled={uploadingState} variant='contained' onClick={addPet}>Add pet</Button>
            </m.div>
        </>
    )
}