"use client"
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
    const isOutsideClicked = useOutsideClick('.popup-content');
    if(isOutsideClicked){
        onClose();
    }
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