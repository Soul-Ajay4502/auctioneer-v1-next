'use client'

import { FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AuthFormErrorMsg from '../auth-form-error-msg'
import { FieldValues } from 'react-hook-form'

type FormInputFieldProps<TFieldValues extends FieldValues> = {
    label: string
    placeholder?: string
    type?: string
    field: TFieldValues
    itemClassName?: string
    labelClassName?: string
    inputClassName?: string
}

export default function FormInputField({
    label,
    placeholder,
    type = 'text',
    field,
    itemClassName = 'w-full',
    labelClassName = 'text-[14px] text-[#414651]',
    inputClassName = 'bg-white rounded-sm',
}: FormInputFieldProps<FieldValues>) {
    return (
        <FormItem className={itemClassName}>
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <FormControl>
                <Input {...field} type={type} className={inputClassName} placeholder={placeholder} />
            </FormControl>
            <AuthFormErrorMsg />
        </FormItem>
    )
}
