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
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

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

  useEffect(() => {
    getOwner()
  }, [])

  return (
    <Card className='m-2'>
      <CardHeader>
        <CardTitle>{owner ? owner.name : <Skeleton className='h-[24px] w-[100px] rounded-lg' />}</CardTitle>
        <CardDescription>
          {`${t('main.pet_card.last_update')}: ${parseMongoDate(updatedAt).date.day}.${parseMongoDate(updatedAt).date.month}.${parseMongoDate(updatedAt).date.year}`}
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <div>
          <img src={'/images/1000.svg'} alt={name} style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden', minWidth: '100%' }} onLoad={(e) => { e.currentTarget.src = imagesPath[0] ? imagesPath[0] : '/images/1000.svg' }} />
        </div>
        <div className='p-6'>
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
