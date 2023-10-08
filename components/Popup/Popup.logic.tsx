"use client"
import { useEffect } from "react";
import PopupView from "./Popup.view";

export interface PopupProps {
    title: string,
    description?: string,
    buttonHandler: () => void,
    onClose: () => void,
    buttonText: string,
}

const Popup: React.FC<PopupProps> = ({
    title,
    description = "",
    buttonHandler,
    buttonText,
    onClose
}) => {

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if(!(target.closest('.popup-content'))){
                onClose();
            }
        }

        window.addEventListener('click', handleClickOutside)

        return (() => {
            window.removeEventListener('click', handleClickOutside)
        })
    }, [onClose])
    
    return (
        <PopupView
            title={title}
            description={description}
            buttonHandler={buttonHandler}
            buttonText={buttonText}
        />
    )
}

export default Popup;