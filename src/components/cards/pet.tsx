/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { PetCard_props } from '@declarations'
import { formatAge } from '@/lib/utils'

export default function PetCard({ name, age, imagesPath }: PetCard_props) {

  // Setups
  const { t } = useTranslation()

  return (
    <div className='relative'>
      <img className='rounded' src={'/images/1000.svg'} alt={name} style={{ aspectRatio: '3/4', objectFit: 'cover', overflow: 'hidden', minWidth: '100%' }} onLoad={(e) => { e.currentTarget.src = imagesPath[0] ? imagesPath[0] : '/images/1000.svg' }} />
      <div className='absolute bottom-0 left-0 p-3 bg-background/85 rounded-tr-xl'>
        <p className='text-2xl font-bold'>{name}, {formatAge(age, t('pet.year'), t('pet.month'))}</p>
      </div>
    </div>
  )
}
