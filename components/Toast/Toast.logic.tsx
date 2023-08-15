"use client"

import React from 'react'
import ToastView from './Toast.view'

export interface ToastProps {
    message: string,
    showToast: boolean,
    onClose: () => void
}

const Toast = ({
    message,
    showToast,
    onClose
}: ToastProps) => {
    return (
        showToast ?
            <ToastView message={message} onClose={onClose} />
            : <></>
    )
}

export default Toast