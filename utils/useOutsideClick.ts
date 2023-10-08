import { useEffect, useState } from "react";

const useOutsideClick = (
    elementIdentifier: string
) => {
    const [isOutsideClicked, setIsOutsideClicked] = useState<boolean>(false);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!(target.closest(elementIdentifier))) {
                setIsOutsideClicked(true)
            }
        }

        window.addEventListener('click', handleClickOutside)

        return (() => {
            window.removeEventListener('click', handleClickOutside)
        })
    }, [elementIdentifier])

    return isOutsideClicked;
}

export default useOutsideClick;