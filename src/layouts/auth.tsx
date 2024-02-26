import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function AuthLayout() {

	// Setups
	const navigate = useNavigate()

	return (
		<m.div className='h-screen' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<Toaster />
			<Button variant={'link'} onClick={() => { navigate('/pwa/settings') }} className='flex gap-1 text-muted-foreground pt-4 mb-0 pb-0 pl-2'>
					<ChevronLeft />
					Back
				</Button>
			<main className='p-4'>
				
				<Outlet />
			</main>
		</m.div>
	)
}
