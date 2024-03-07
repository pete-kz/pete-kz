/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { PetCard_props } from '@declarations'
import { formatAge } from '@/lib/utils'

export default function PetCard({ name, birthDate, imagesPath }: PetCard_props) {

  // Setups
  const { t } = useTranslation()

  return (
    <div className='relative'>
      <img src={imagesPath[0]} alt={name} style={{ aspectRatio: '3/4', objectFit: 'cover', overflow: 'hidden', minWidth: '100%' }} />
      <div className='absolute flex items-end bottom-0 left-0 p-3 bg-gradient-to-t w-full h-full from-black from-2% to-transparent to-40%'>
        <div>
          <p className='text-2xl font-bold'>{name}</p>
          <p>{formatAge(birthDate, t('pet.year'), t('pet.month'))}</p>
        </div>
      </div>
    </div>
  )
}
