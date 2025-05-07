import React from 'react'

interface FormOverlayWrapperProps {
    isSubmitting: boolean
    children: React.ReactNode
}

const FormOverlayWrapper: React.FC<FormOverlayWrapperProps> = ({ isSubmitting, children }) => {
    return (
        <div className="relative">
            {isSubmitting && (
                <div className="absolute inset-0 bg-transparent bg-opacity-50 z-10 flex justify-center items-center" />
            )}
            {children}
        </div>
    )
}

export default FormOverlayWrapper
