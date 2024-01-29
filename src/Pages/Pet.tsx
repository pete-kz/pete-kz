/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'
import LoadingPage from '@/Components/LoadingPage'
import { Button, TextField } from '@mui/material'

function useQuery() {
    const { search } = useLocation()

    return React.useMemo(() => new URLSearchParams(search), [search])
}


export default function PetPage() {

    // Setups
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const signout = useSignOut()
    const authHeader = useAuthHeader()
    const { t } = useTranslation()
    const query = useQuery()

    // States
    const [petData, setPetData] = useState<Pet_Response>()
    const [ownerData, setOwnerData] = useState<User_Response>()
    const [editMode, setEditMode] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [age, setAge] = useState<string>('')
    const [description, setDescription] = useState<string>('')


    // Functions
    function fetchPet() {
        axios.post(`${API.baseURL}/pets/find`).then((res: AxiosResponse) => {
            if (!res.data.err) {
                const petOne = (res.data as Pet_Response[]).filter(petOne => petOne._id === query.get('id'))[0]
                setPetData(petOne)
                setName(petOne.name)
                setAge(petOne.age)
                setDescription(petOne.description)
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    function fetchOwner() {
        axios.post(`${API.baseURL}/users/find`, { query: { _id: petData?.userID } }).then((res: AxiosResponse) => {
            if (!res.data.err) {
                setOwnerData(res.data)
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    function checkToken() {
        const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem('_auth')}`
        const isEqualTokens = authHeader() == token
        if (!isEqualTokens) {
            signout()
        }
    }

    function checkEditMode() {
        if (query.get('edit') === 'true' && ownerData?._id == user._id) {
            setEditMode(true)
        }
    }

    function updatePetInfo() {
        notification.custom.promise(
            axios.post(`${API.baseURL}/pets/edit`, {
                query: { _id: petData?._id},
                updated: {
                    name, 
                    age, 
                    description
                }
            })
        )
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

        fetchPet()
        checkToken()
    }, [])

    useEffect(() => {
        checkEditMode()
        fetchOwner()
    }, [petData])

    return (
        <>
            {petData && (
                editMode ? (
                    <m.div className='m-2 p-2' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div>
                            <p>Picture cannot be changed</p>
                            {petData.imagesPath.map((image, index) => (
                                <img src={image} className='flex' style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden' }} key={image} />
                            ))}
                        </div>
                        <div className='gap-2 flex flex-col'>
                            <div className='flex gap-2 w-full'>
                                <TextField defaultValue={name} label={'Name'} variant="outlined" onChange={handleNameChange} />
                                <TextField defaultValue={age} label={'Age'} style={{ width: 60 }} variant="outlined" onChange={handleAgeChange} type='number' />
                            </div>
                            <TextField defaultValue={description} label={'Description'} variant="outlined" onChange={handleDescriptionChange} multiline />
                        </div>
                        <Button className='w-full' style={{ marginTop: 10 }} variant='contained' onClick={updatePetInfo}>Update</Button>
                    </m.div>
                ) : (
                    <m.div className='m-2 p-2' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div>
                            {petData.imagesPath.map((image, index) => (
                                <img src={image} className='flex' style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden' }} key={image} />
                            ))}
                        </div>
                        <div>
                            <p>{petData.name}, {petData.age}</p>
                            <p>{petData.description}</p>
                        </div>
                        <div>
                            <p>Owner: {ownerData?.login}</p>
                            <p>Contacts:</p>
                            {ownerData?.social.instagram && (<p> instagram: {ownerData?.social.instagram}</p>)}
                            {ownerData?.social.telegram && (<p> telegram: {ownerData?.social.telegram}</p>)}
                            {ownerData?.social.phone && (<p> phone: {ownerData?.social.phone}</p>)}

                        </div>
                    </m.div>
                )
            )}
        </>
    )
}
