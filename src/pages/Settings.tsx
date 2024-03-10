import React from 'react'
import { useTranslation } from 'react-i18next'
import ChangeLanguage from '@/components/change-language'
import ChangeCity from '@/components/change-city'
import { m } from 'framer-motion'
import SupportCard from '@/components/cards/support'
// import { ModeToggle } from '@/components/mode-toggle'
import ProjectCard from '@/components/cards/project'
import MobilePageHeader from '@/components/mobile-page-header'

export default function Settings() {

	// Setups
	const { t } = useTranslation()

	return (
		<>
			<MobilePageHeader title={t('header.settings')} to='/pwa/profile' />
			<m.div className="grid p-4 gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
				<ProjectCard />
				<SupportCard />
				<ChangeCity />
				<div>
					<ChangeLanguage />
				</div>
			</m.div>
		</>
	)
}
