"use client"
import { useRef } from "react";
import PopupView from "./Popup.view";
import useOutsideClick from "@/utils/useOutsideClick";

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
    const popupRef = useRef(null);
    const isOutsideClicked = useOutsideClick(popupRef);
    if (isOutsideClicked) {
        onClose();
    }
    return (
        <PopupView
            popupRef={popupRef}
            title={title}
            description={description}
            buttonHandler={buttonHandler}
            buttonText={buttonText}
        />
    )
}

export default Popup;