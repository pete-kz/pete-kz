import React, { lazy, useMemo } from 'react'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import { useTranslation } from 'react-i18next'
import { AuthState, User_Response } from '@declarations'
import { useNavigate } from 'react-router-dom'
import { Pencil, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { parseMongoDate } from '@/lib/utils'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'


const ChangeProfileForm = lazy(() => import('@/components/forms/change-profile'))

export default function UserProfileCard({ user }: { user: User_Response }) {

    // Setups
    const { t } = useTranslation()
    const navigate = useNavigate()
    const signout = useSignOut()
    const authState = useAuthUser<AuthState>()

    // Functions
    const userLastUpdated = useMemo(() => {
        if (!user) return ''
        const parsedDate = parseMongoDate(user.updatedAt)
        return parsedDate ? `${parsedDate.date.day}/${parsedDate.date.month}/${parsedDate.date.year} ${parsedDate.time.hour}:${parsedDate.time.minutes}` : ''
    }, [user])

    return (
        <Card className='p-3 flex flex-col gap-4'>
            <div className='flex gap-2'>
                <Avatar>
                    <AvatarImage src={'/images/pete-logo.svg'} alt={'PETE'} />
                    <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div>
                    <p className='font-bold'>{user.companyName ? user.companyName : `${user.firstName} ${user.lastName}`}</p>
                    <p className=''>{`${t('label.lastUpdated')}: ${userLastUpdated}`}</p>
                </div>
            </div>
            {authState && authState?._id === user._id && (
                <div className='grid grid-cols-2 border grid-rows-1 rounded-lg'>
                <ChangeProfileForm>
                    <Button className='rounded-none p-2 m-0 border-r gap-2 rounded-l-lg' type='submit' variant={'link'}>
                        {t('label.edit')}<Pencil />
                    </Button>
                </ChangeProfileForm>
                <Button variant={'link'} className='text-red-500 hover:bg-red-500 hover:text-white hover:rounded-r-lg rounded-r-lg border-l rounded-none p-2 m-0 gap-2' onClick={() => { signout(); navigate('/pwa') }}>
                {t('label.logout')}<LogOut />
                </Button>
            </div>
            )}
        </Card>
    )
}