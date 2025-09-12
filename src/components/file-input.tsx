'use client'

import type React from 'react'
import { useRef, useState, useCallback } from 'react'
import { Upload, X, File, ImageIcon, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SimpleFileInputProps {
    onFileSelect?: (file: File | null) => void
    accept?: string
    maxSize?: number // in MB
    className?: string
    disabled?: boolean
}

export function GenZFileInput({ onFileSelect, accept, maxSize = 10, className, disabled = false }: SimpleFileInputProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = useCallback(
        (files: FileList | null) => {
            if (!files || disabled) return
            const file = files[0]
            if (!file) return

            if (maxSize && file.size > maxSize * 1024 * 1024) {
                alert(`File size should not exceed ${maxSize} MB`)
                return
            }

            setSelectedFile(file)
            onFileSelect?.(file)
        },
        [maxSize, onFileSelect, disabled],
    )

    const handleClick = () => {
        if (!disabled) fileInputRef.current?.click()
    }

    const removeFile = () => {
        setSelectedFile(null)
        onFileSelect?.(null)
    }

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
        if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />
        return <File className="w-4 h-4" />
    }

    return (
        <div className={cn('space-y-2', className)}>
            {/* Small Trigger */}
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className={cn(
                    'inline-flex justify-center items-center gap-1 rounded-md border px-2 py-1 text-sm w-full shadow-2xl',
                    'hover:bg-accent transition-colors',
                    disabled && 'opacity-50 cursor-not-allowed',
                )}>
                <Upload className="w-4 h-4" />
                {selectedFile ? 'Change File' : 'Upload'}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="sr-only"
                disabled={disabled}
            />

            {/* Selected File Preview */}
            {selectedFile && (
                <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <div className="flex items-center gap-2 truncate">
                        {getFileIcon(selectedFile)}
                        <span className="truncate">{selectedFile.name}</span>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="ml-2 rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
