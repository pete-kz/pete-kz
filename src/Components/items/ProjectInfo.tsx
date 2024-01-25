import React, { useEffect, useState } from 'react'
import { Typography, Avatar } from '@mui/material'
import { API } from '@config'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'

export default function ProjectInfo() {
	// States
	const [NAME, setName] = useState<string>('')
	const [VERSION, setVersion] = useState<string>('')

	// Functions
	function fetchSettings() {
		axios.get(`${API.baseURL}/config/`).then((response: AxiosResponse) => {
			if (!response.data.err) {
				setName(response.data.name)
				setVersion(response.data.version)
			} else {
				notification.custom.error(response.data.err)
			}
		})
	}

	useEffect(() => {
		fetchSettings()
	}, [])

	return (
		<div style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
			{/* <Avatar src={AuthorIcon} /> */}
			<Avatar>{NAME[0]}</Avatar>
			<div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
				{NAME}
				<Typography variant="body2" color="text.secondary">
					{VERSION}
				</Typography>
			</div>
		</div>
	)
}
