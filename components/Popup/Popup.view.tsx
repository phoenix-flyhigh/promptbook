"use client"

import React from 'react'
import { PopupProps } from './Popup.logic'

interface PopupViewProps extends Omit<PopupProps, 'onClose'> { }

const PopupView: (props: PopupViewProps) => JSX.Element = ({
    title,
    description,
    buttonHandler,
    buttonText
}) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 w-full'>
            <main className='bg-white p-8 rounded-lg shadow-lg popup-content flex justify-center flex-col'>
                <h2 className='text-2xl font-semibold mb-4'>
                    {title}
                </h2>
                <p>
                    {description}
                </p>
                <button
                    className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                    onClick={buttonHandler}
                >
                    {buttonText}
                </button>
            </main>
        </div>
    )
}

export default PopupView