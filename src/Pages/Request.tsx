/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, Select, type SelectChangeEvent, InputLabel, MenuItem, FormControl } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { ImageOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { axiosAuth as axios, notification } from '@utils'
import { API } from '@config'
import { m } from 'framer-motion'
import { themeColor } from '@colors'
import { type RequestInstitution_Data } from '@declarations'
import RequestInstitutionCard from '@/Components/Cards/RequestInstitution.card'
import { AxiosResponse } from 'axios'

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	flex-direction: column;
`

const EndSpacer = styled.div`
	width: 1px;
	height: 1px;
	margin-bottom: 100px;
`

const Spacer = styled.div`
	display:flex;
	justify-content: center;
	align-items: center;
`

const cities: Array<{ label: string }> = [{ label: 'Алматы' }, { label: 'Астана' }, { label: 'Шымкент' }]

export default function Request() {

	// Setups
	const isAuthenticated = useIsAuthenticated()
	const authStateUser = useAuthUser()
	const navigate = useNavigate()
	const user = authStateUser() || {}
	const { t } = useTranslation()

	// States
	const [file, setFile] = useState<undefined | Blob>(undefined)
	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [link, setLink] = useState<string>('')
	const [address, setAddress] = useState<string>('')
	const [city, setCity] = useState<string>('')
	const [uploadingState, setUploadingState] = useState<boolean>(false)
	const [open, setOpen] = useState<boolean>(false)
	const [requests, setRequests] = useState<RequestInstitution_Data[]>([])

	// Handlers
	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
	}
	const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDescription(event.target.value)
	}
	const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLink(event.target.value)
	}
	const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(event.target.value)
	}

	// Functions
	const closeAlert = () => {
		setOpen(false)
		window.location.reload()
	}

	async function fetchRequests() {
		notification.custom.promise(axios.post(`${API.baseURL}/institutions/request/find`, { query: {} })
			.then((response: AxiosResponse) => {
				if (!response.data.err) {
					setRequests(response.data)
				} else {
					notification.custom.error(response.data.err)
				}
			}))
	}

	const sendRequest = async () => {
		if (isFormValid()) {
			setUploadingState(true)
			const formData = new FormData()
			formData.append('title', title)
			formData.append('description', description)
			formData.append('link', link)
			formData.append('address', address)
			formData.append('userRequestID', user._id)
			formData.append('image', file!)
			formData.append('city', city)

			axios.post(`${API.baseURL}/institutions/request/new`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
				.then((response: AxiosResponse) => {
					if (!response.data.err) {
						setOpen(true)
						setUploadingState(false)
					} else {
						setOpen(false)
						setUploadingState(false)
						notification.custom.error(response.data.err)
					}
				})
			setUploadingState(false)
		}
	}

	function checkImage() {
		if (file == undefined) {
			return ''
		}
		return URL.createObjectURL(file)
	}

	function isFormValid() {
		if (title == '' || description == '' || city == '' || address == '' || link == '') {
			notification.custom.error(t('errors.fill_all_fields'))
			return false
		}
		if (link.includes('https') || link.includes('http')) {
			return true
		}
		notification.custom.error(t('errors.invalid_link'))
		return false
	}

	useEffect(() => {
		if (isAuthenticated()) {
			fetchRequests()
		} else {
			navigate('/login')
		}
	}, [])

	return (
		<>
			<Dialog open={open} onClose={closeAlert}>
				<DialogContent>
					<DialogContentText>
						{t('request.request_sent_and_later_will_be_checked_by_moderators')}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeAlert} autoFocus>
						ОК
					</Button>
				</DialogActions>
			</Dialog>
			<m.div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<div className="mb-1 mt-2 mx-2 rounded-2xl" style={{ backgroundColor: themeColor[2], maxWidth: '500px' }}>
					<div>
						<p className="ml-1 pt-4 px-4">{t('request.request_for_new_institution_label')}</p>
						{checkImage()
							&& (
								<div className="pt-2 mt-2 mb-2">
									<div className="flex justify-center ">
										<img src={checkImage()} className="min-w-full" style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden' }} />
									</div>
								</div>
							)}
						<Box sx={{ display: 'flex', flexDirection: 'column' }} className="mt-2 px-4">
							<TextField
								InputLabelProps={{ shrink: true }}
								margin="normal"
								required
								id="input-title"
								label={t('request.inputs.title.label')}
								placeholder={t('request.inputs.title.example')!}
								onChange={handleTitleChange}
							/>
							<TextField
								InputLabelProps={{ shrink: true }}
								margin="normal"
								required
								id="input-description"
								label={t('request.inputs.description.label')}
								multiline
								placeholder={t('request.inputs.description.example')!}
								onChange={handleDescriptionChange}
							/>
							<FormControl fullWidth style={{ marginTop: 8 }}>
								<InputLabel>{t('main.select_button_city')}</InputLabel>
								<Select
									value={city}
									label={t('main.select_button_city')}
									className="rounded-3xl"
									onChange={(event: SelectChangeEvent) => { setCity(event.target.value) }}
								>
									<MenuItem value="">{t('main.select_button_city_everything_option')}</MenuItem>
									{cities.map((_city: { label: string }) => (
										<MenuItem value={_city.label}>{_city.label}</MenuItem>
									))}
								</Select>
							</FormControl>
							<TextField
								InputLabelProps={{ shrink: true }}
								margin="normal"
								required
								id="input-address"
								label={t('request.inputs.address.label')}
								placeholder={t('request.inputs.address.example')!}
								onChange={handleAddressChange}
							/>
							<TextField
								InputLabelProps={{ shrink: true }}
								margin="normal"
								id="input-link"
								placeholder="https://..."
								required
								label={t('request.inputs.link.label')}
								onChange={handleLinkChange}
							/>
						</Box>
					</div>
					<div className="flex justify-between mt-3 flex-row px-4 pb-4">
						<div className="flex flex-row">
							<LoadingButton
								loading={uploadingState}
								onClick={sendRequest}
								variant="outlined"
								sx={{
									borderColor: themeColor[12], color: themeColor[7], borderRadius: 9999, fontWeight: 500, paddingLeft: '12px', paddingRight: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center',
								}}
								loadingIndicator={t('request.buttons.request.loading_state')}
							>
								{t('request.buttons.request.label')}
							</LoadingButton>
							<Button
								variant="outlined"
								sx={{
									borderColor: themeColor[12], color: themeColor[7], borderRadius: 9999, fontWeight: 500, paddingLeft: '12px', paddingRight: '12px', marginLeft: 1, border: 1,
								}}
								className="flex justify-center items-center"
								component="label"
							>
								<ImageOutlined sx={{ marginRight: 0.3 }} />
								<p className="text-xs w-min mr-1">
									{t('request.buttons.img.label')}
									{' '}
								</p>
								<input
									type="file"
									accept="image/png, image/jpeg, image/jpg"
									data-filename={file}
									onChange={(event) => { setFile((event.target as HTMLInputElement).files![0]) }}
									hidden
								/>
							</Button>
						</div>
					</div>
				</div>
			</m.div>
			<Wrapper>
				{requests.map(({
					title, address, description, link, imagePath, city,
				}, index: number) => (
					<Spacer key={index}>
						<RequestInstitutionCard name={title} address={address} description={description} link={link} imagePath={imagePath} city={city} />
					</Spacer>
				))}
			</Wrapper>
			<EndSpacer />
		</>
	)
}
