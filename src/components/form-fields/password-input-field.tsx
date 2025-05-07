'use client'

import { FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AuthFormErrorMsg from '../auth-form-error-msg'
import { FieldValues } from 'react-hook-form'

type PasswordInputFieldProps<TFieldValues extends FieldValues> = {
    label: string
    placeholder?: string
    field: TFieldValues
    itemClassName?: string
    labelClassName?: string
    inputClassName?: string
    showEyeIcon?: boolean
}

export default function PasswordInputField<TFieldValues extends FieldValues>({
    label,
    placeholder = 'Your password',
    field,
    itemClassName = 'w-full',
    labelClassName = 'text-[14px] text-[#414651]',
    inputClassName = 'bg-white rounded-sm',
}: PasswordInputFieldProps<TFieldValues>) {
    return (
        <FormItem className={itemClassName}>
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <FormControl>
                <Input
                    {...field}
                    type="password"
                    value={field.value || ''}
                    className={inputClassName}
                    placeholder={placeholder}
                />
            </FormControl>
            <AuthFormErrorMsg />
        </FormItem>
    )
}
