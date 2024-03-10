import React, { useEffect, useState } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from '@/components/ui/drawer'
import { Pet_Filter } from '@/lib/declarations'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from './ui/checkbox'
import { useTranslation } from 'react-i18next'
import { Slider } from '@/components/ui/slider'
import { filterValues } from '@/lib/utils'


export default function PetFilter({ setFilter, filter, children }: { setFilter: React.Dispatch<React.SetStateAction<Pet_Filter>>, filter: Pet_Filter, children: React.ReactNode }) {
    // Setups
    const { t } = useTranslation()

    // States
    const [tempFilter, setTempFilter] = useState<Pet_Filter>(filter)
    const [sliderValue, setSliderValue] = useState<number>(filter.weight || 0)

    // Functions
    function onSubmit() {
        setFilter(tempFilter!)
    }

    useEffect(() => { setTempFilter((filt) => { filt.weight = sliderValue; return filt }) }, [sliderValue])

    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Filter pets</DrawerTitle>
                        <DrawerDescription>So you can find your ideal one!</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="grid space-y-4">
                            <div className='grid gap-1.5'>
                                <Label htmlFor="">{t('pet.type.default')}</Label>
                                <Select value={tempFilter?.type} onValueChange={(value: string) => {
                                    setTempFilter(filt => { filt.type = value; return filt })
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={'None'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterValues.type.map((typepet) => (
                                            <SelectItem key={typepet} value={typepet}>{t('pet.type.'+typepet)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='grid gap-1.5'>
                                <Label htmlFor="sex">{t('pet.sex.default')}</Label>
                                <Select value={tempFilter?.sex} onValueChange={(value: string) => {
                                    setTempFilter(filt => { filt.sex = value as Pet_Filter['sex']; return filt })
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={'None'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterValues.sex.map((petSex) => (
                                            <SelectItem key={petSex} value={petSex}>{t('pet.sex.'+petSex)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="sterilized_checkbox">
                                    {t('pet.sterilized')}?
                                </Label>
                                <Checkbox id="sterilized_checkbox" checked={tempFilter?.sterilized} onCheckedChange={(value) => { 
                                    setTempFilter(filt => { filt.sterilized = (value != 'indeterminate' ? value : filt.sterilized); return filt })
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slider_weight">
                                    {`${t('pet.weight')} = ${sliderValue}`}
                                </Label>
                                <Slider id='slider_weight' value={[sliderValue]} onValueChange={(value) => {
                                    setSliderValue(value[0])
                                }} step={5} />
                            </div>
                            <div className='grid gap-1.5'>
                                <Label htmlFor="">{t('pet.ownerType')}</Label>
                                <Select value={tempFilter?.owner_type} onValueChange={(value: string) => {
                                    setTempFilter(filt => { filt.owner_type = value as Pet_Filter['owner_type']; return filt })
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={'None'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterValues.owner_type.map((ownerType) => (
                                            <SelectItem key={ownerType} value={ownerType}>{t('user.type.'+ownerType)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button onClick={onSubmit}>{t('label.apply')}</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}