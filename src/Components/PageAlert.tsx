import React from 'react'
import { type PageAlert_Props } from '@declarations'
import { m } from 'framer-motion'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { NavLink } from 'react-router-dom'

export default function PageAlert(props: PageAlert_Props) {
	return (
		<m.div className='flex flex-row my-1 mx-2 rounded-2xl w-full border-2 bg-amber-800/25 py-2 border-amber-700' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div className='flex-col mx-3'>
				<div className='text-amber-500'>
					<WarningAmberOutlinedIcon className='mr-1' />{props.title}
				</div>
				<div className='text-zinc-300'>
					{props.description}
				</div>
				<div className='flex flex-row'>
					<NavLink to='/disclaimer' className='text-amber-500 active:text-amber-900 duration-150 underline'>Читать</NavLink>
				</div>
			</div>
		</m.div>
	)
}
