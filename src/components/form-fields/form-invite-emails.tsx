'use client'

import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CircleX, Plus } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Label } from '../ui/label'

interface InviteEmailFieldsProps {
    duplicateEmail: string[]
    hasEmptyEmailField: boolean
    label: string
}

export default function InviteEmailFields({ label, duplicateEmail, hasEmptyEmailField }: InviteEmailFieldsProps) {
    const form = useFormContext()
    const { control, formState } = form

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'emails',
    })

    return (
        <div className="space-y-2 ">
            <Label>{label}</Label>
            <div className="space-y-2 max-h-[100px] overflow-y-auto bg-transparent p-2 custom-scroll">
                {fields.map((field, index) => (
                    <FormField
                        key={field.id}
                        control={control}
                        name={`emails.${index}.value`}
                        render={({ field }) => (
                            <FormItem>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email address"
                                            {...field}
                                            className="bg-white rounded-sm"
                                        />
                                    </FormControl>
                                    <Button
                                        variant="ghost"
                                        className="absolute right-0 top-2 h-5 w-5 rounded-full"
                                        onClick={() => remove(index)}
                                        type="button">
                                        <CircleX />
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
            </div>
            {duplicateEmail.length > 0 && (
                <p className="text-sm text-red-500 mt-1">{duplicateEmail.join(', ')} is repeated. Please remove duplicates.</p>
            )}

            {formState.errors.emails && (
                <p className="text-sm text-red-500 mt-1">
                    {String(formState.errors.emails.message || formState.errors.emails.root?.message || '')}
                </p>
            )}

            <Button
                type="button"
                variant="ghost"
                className="flex items-center text-sm mt-2"
                disabled={
                    fields.length > 0 &&
                    (duplicateEmail.length > 0 || formState.errors.emails !== undefined || hasEmptyEmailField)
                }
                onClick={() => {
                    append({ value: '' })
                    form.clearErrors()
                }}>
                <Plus className="w-4 h-4 mr-1" />
                Add another
            </Button>
        </div>
    )
}
