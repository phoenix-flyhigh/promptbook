import { useEffect, useRef, useState } from "react";

const useOutsideClick = (
    elementRef: any
) => {
    const [isOutsideClicked, setIsOutsideClicked] = useState<boolean>(false);
    useEffect(() => {
        if(!elementRef) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (elementRef.current && !elementRef.current.contains(target)) {
                setIsOutsideClicked(true)
            }
        }

        window.addEventListener('click', handleClickOutside)

        return (() => {
            window.removeEventListener('click', handleClickOutside)
        })
    }, [elementRef])

    return isOutsideClicked;
}

export default useOutsideClick;