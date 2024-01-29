import React from 'react'
import { Logout } from '@mui/icons-material'
import { useSignOut } from 'react-auth-kit'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography, Avatar } from '@mui/material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import PatreonIcon from '@/Images/patreon-app-icon.png'
import AuthorIcon from '@/Images/artchsh_icon.png'
import LanguageSwitcher from '@/Components/LanguageSwitcher'

export default function Settings() {

	// Setups
	const signout = useSignOut()
	const { t } = useTranslation()

	return (
		<m.div className="flex justify-center w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div className="max-w-xl">
				<List>
					<ListItem disablePadding>
						<ListItemButton onClick={() => { window.open('https://www.patreon.com/charlzWeb/membership', '_blank') }}>
							<ListItemIcon>
								<Avatar src={PatreonIcon} />
							</ListItemIcon>
							<ListItemText primary="Patreon" secondary={t('settings.labels.support_project')} />
						</ListItemButton>
					</ListItem>
					<ListItem>
						<LanguageSwitcher />
					</ListItem>
					<ListItem disablePadding>
                        <ListItemButton onClick={() => { signout() }} sx={{ color: '#eb4034' }}>
                            <ListItemIcon>
                                <Logout color="error" />
                            </ListItemIcon>
                            <ListItemText primary={t('settings.labels.exit_button')} />
                        </ListItemButton>
                    </ListItem>
				</List>
				<div className="flex justify-center items-center mt-5" style={{ marginBottom: 76 }}>
					<Paper elevation={0} sx={{ background: 'none' }}>
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<div style={{
								display: 'flex', flexDirection: 'row', margin: 10, background: 'none',
							}}
							>
								<Avatar src={AuthorIcon} />
								<div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
									<a href="https://github.com/artchsh" target="_blank" rel="noreferrer">artchsh</a>
									<Typography variant="body2" color="text.secondary">
										{t('settings.authors.developer_and_author_of_the_project')}
									</Typography>
								</div>
							</div>
						</div>
					</Paper>
				</div>
			</div>
		</m.div>
	)
}
