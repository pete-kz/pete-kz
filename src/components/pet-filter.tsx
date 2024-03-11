import React, { useState } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from '@/components/ui/drawer'
import { Pet_Filter } from '@/lib/declarations'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from './ui/checkbox'
import { useTranslation } from 'react-i18next'
import { Slider } from '@/components/ui/slider'
import { filterValues, defaultFilterValue } from '@/lib/utils'


export default function PetFilter({ updateFilter, filter, children }: { updateFilter: (filter: Pet_Filter) => void, filter: Pet_Filter, children: React.ReactNode }) {
    // Setups
    const { t } = useTranslation()

    // States
    const [type, setType] = useState<Pet_Filter['type']>(filter.type)
    const [sterilized, setSterilized] = useState<Pet_Filter['sterilized']>(filter.sterilized)
    const [sex, setSex] = useState<Pet_Filter['sex'] | string>(filter.sex)
    const [weight, setWeight] = useState<Pet_Filter['weight']>(filter.weight || 0)
    const [ownerType, setOwnerType] = useState<Pet_Filter['owner_type'] | string>(filter.owner_type)

    // Functions
    function onSubmit() {
        updateFilter({
            type,
            sterilized,
            sex: sex as Pet_Filter['sex'],
            weight,
            owner_type: ownerType as Pet_Filter['owner_type']
        })
    }

    function reset() {
        setType(defaultFilterValue.type)
        setSterilized(defaultFilterValue.sterilized)
        setSex(defaultFilterValue.sex)
        setWeight(defaultFilterValue.weight)
        setOwnerType(defaultFilterValue.owner_type)
        updateFilter({
            type: defaultFilterValue.type,
            sterilized: defaultFilterValue.sterilized,
            sex: defaultFilterValue.sex,
            weight: defaultFilterValue.weight,
            owner_type: defaultFilterValue.owner_type
        })
    }

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
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={'None'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterValues.type.map((typepet) => (
                                            <SelectItem key={typepet} value={typepet}>{t('pet.type.' + typepet)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='grid gap-1.5'>
                                <Label htmlFor="sex">{t('pet.sex.default')}</Label>
                                <Select value={sex} onValueChange={setSex}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={'None'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterValues.sex.map((petSex) => (
                                            <SelectItem key={petSex} value={petSex}>{t('pet.sex.' + petSex)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="sterilized_checkbox">
                                    {t('pet.sterilized')}?
                                </Label>
                                <Checkbox id="sterilized_checkbox" checked={sterilized} onCheckedChange={(value) => {
                                    setSterilized(_ => value !== 'indeterminate' ? value : _)
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slider_weight">
                                    {`${t('pet.weight')} = ${weight}`}
                                </Label>
                                <Slider id='slider_weight' value={[weight!]} onValueChange={(value) => {
                                    setWeight(value[0])
                                }} step={5} />
                            </div>
                            <div className='grid gap-1.5'>
                                <Label htmlFor="">{t('pet.ownerType')}</Label>
                                <Select value={ownerType} onValueChange={setOwnerType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={'None'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterValues.owner_type.map((ownerType) => (
                                            <SelectItem key={ownerType} value={ownerType}>{t('user.type.' + ownerType)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className='flex flex-row w-full gap-1.5'>
                        <DrawerClose asChild>
                            <Button className='w-full' onClick={onSubmit}>{t('label.apply')}</Button>
                        </DrawerClose>
                        <Button className='w-full' variant={'outline'} type='reset' onClick={reset}>{t('label.reset')}</Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}