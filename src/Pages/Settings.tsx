import React from 'react'
import { Logout } from '@mui/icons-material'
import { useSignOut } from 'react-auth-kit'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/Components/LanguageSwitcher'

export default function Settings() {

	// Setups
	const signout = useSignOut()
	const { t } = useTranslation()

	return (
		<m.div className="flex justify-center w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div className="max-w-xl">
				<List>
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
			</div>
		</m.div>
	)
}
