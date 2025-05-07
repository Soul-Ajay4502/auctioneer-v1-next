'use client'

import { FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { FieldValues } from 'react-hook-form'

type Option = {
    label: string
    value: string
}

type FormSelectFieldProps<TFieldValues extends FieldValues> = {
    label: string
    placeholder?: string
    description?: string
    field: TFieldValues
    options: Option[]
}

export default function FormSelectField<TFieldValues extends FieldValues>({
    label,
    placeholder = 'Select an option',
    description,
    field,
    options,
}: FormSelectFieldProps<TFieldValues>) {
    return (
        <FormItem className="w-full">
            <FormLabel className="text-sm font-medium">{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full rounded-sm">
                    <SelectTrigger>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
        </FormItem>
    )
}
