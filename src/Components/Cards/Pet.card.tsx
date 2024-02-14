/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { User_Response, PetCard_props } from '@declarations'
import { API } from '@config'
import { axiosAuth as axios, notification, parseMongoDate } from '@utils'
import { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { formatAge } from '@/lib/utils'

// UI
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'

export default function PetCard({ id, name, age, userID, imagesPath, updatedAt }: PetCard_props) {

  // Setups
  const { t } = useTranslation()
  const navigate = useNavigate()

  // States
  const [owner, setOwner] = useState<User_Response>()

  // Functions
  function getOwner() {
    axios.post(`${API.baseURL}/users/find`, { query: { _id: userID } }).then((res: AxiosResponse) => {
      if (!res.data.err) {
        setOwner(res.data)
      } else {
        notification.custom.error(res.data.err)
      }
    })
  }

  if (userID == null) {
    localStorage.removeItem('token')
    location.reload()
  }

  useEffect(() => {
    getOwner()
  }, [])

  return (
    <Card className='m-2'>
      <CardHeader>
        <CardTitle>{owner?.name}</CardTitle>
        <CardDescription>
          {`${t('main.pet_card.last_update')}: ${parseMongoDate(updatedAt).date.day}.${parseMongoDate(updatedAt).date.month}.${parseMongoDate(updatedAt).date.year}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <img src={imagesPath[0]} alt={name} style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden', minWidth: '100%' }} />
        </div>
        <div className='mt-3'>
          <p className='text-2xl font-bold'>{name}, {formatAge(age, t('pet.year'), t('pet.month'))}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className='w-full' onClick={() => { navigate(`/pwa/pets?id=${id}&more=true`) }}>
          {t('main.pet_card.more')}
        </Button>
      </CardFooter>
    </Card>

  )
}
