import React from 'react'
import { Tabs, Tab, Typography, Box } from '@mui/material'
import ReactImageGallery from 'react-image-gallery'
import { main } from '@config'

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel({ children, value, index, ...other }: TabPanelProps) {

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`how-to-install-tabpanel-${index}`}
            aria-labelledby={`how-to-install-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `how-to-install-tab-${index}`,
        'aria-controls': `how-to-install-tab-${index}`,
    }
}

export default function HowToInstall() {
    // States
    const [value, setValue] = React.useState(0)

    // Handlers
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="PWA Instructions">
                    <Tab label="IOS" {...a11yProps(0)} />
                    <Tab label="Android" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ReactImageGallery showPlayButton={false} showThumbnails={false} autoPlay={false} showFullscreenButton={false} items={main.howToInstallPictures.IOS} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Android
            </CustomTabPanel>
        </Box>
    )
}
