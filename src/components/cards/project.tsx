import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ProjectCard({ description = false }: { description?: boolean }) {
	const { t } = useTranslation()

	return (
		<div className='p-4 flex flex-col items-center justify-center'>
			<img loading='lazy' src="/images/pete-logo.svg" width={30} />
			<p className='text-2xl font-semibold'>Pete</p>
			{description && <p className='text-muted-foreground'>{t('label.slogan')}</p>}
		</div>
	)
}