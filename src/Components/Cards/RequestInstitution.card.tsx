import React from 'react'
import { Typography, IconButton, Avatar } from '@mui/material'
import { InsertLink } from '@mui/icons-material'
import { m } from 'framer-motion'
import { type RequestInstitutionCard_Props } from '@declarations'
import { themeColor } from '@colors'

export default function RequestInstitutionCard({ name, address, description, link, imagePath, city, }: RequestInstitutionCard_Props) {
	return (
		<m.div className="my-1 rounded-2xl w-full" style={{ backgroundColor: themeColor[2], width: '95vw' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div className="flex flex-start flex-row items-center p-4 pb-0">
				<div className="flex rounded-full">
					<Avatar>{name[0]}</Avatar>
				</div>
				<div className="flex flex-col ml-4">
					<h4 className="" style={{ color: themeColor[11] }}>{name}</h4>
				</div>
			</div>
			{imagePath !== undefined && imagePath !== ''
				&& (
					<div className="pt-2 mt-2 mb-2">
						<div className="flex justify-center ">
							<img src={imagePath} alt="" className="min-w-full" style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden' }} />
						</div>
					</div>
				)}
			<div className="mt-4 px-4 ">
				<Typography variant="body2" color="text.secondary">
					Адрес: {' '}{city},{' '}{address}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{description}
				</Typography>
			</div>
			<div className="flex flex-start mt-7 flex-row px-4 pb-4">
				<div className="flex flex-row">
					<IconButton
						sx={{
							borderColor: themeColor[12], color: themeColor[7], borderRadius: 9999, fontWeight: 500, paddingLeft: '12px', paddingRight: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 1,
						}}
						onClick={() => { window.open(link, '_blank') }}>
						<InsertLink />{' '}<p className="text-sm ml-2 mr-2">Ссылка</p>
					</IconButton>
				</div>
			</div>
		</m.div>
	)
}
