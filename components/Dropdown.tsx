import useOutsideClick from "@/utils/useOutsideClick";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRef } from "react";

interface DropDownProps {
    userId: string,
    onClose: () => void
}

const ProfileMenu: React.FC<DropDownProps> = ({
    userId,
    onClose
}) => {
    const dropdownRef = useRef(null);
    const clickedOutsideDropdown = useOutsideClick(dropdownRef)
    if (clickedOutsideDropdown) {
        onClose()
    }
    return (
        <div
            className="dropdown"
            data-testid="tid-nav-dropdown"
            ref={dropdownRef}
        >
            <Link
                href={`/profile?id=${userId}`}
                className="dropdown_link"
                onClick={onClose}
            >
                My Profile
            </Link>
            <Link
                href="/create-post"
                className="dropdown_link"
                onClick={onClose}
            >
                Create Post
            </Link>
            <button
                type="button"
                className="mt-5 w-full black_btn"
                onClick={() => {
                    onClose();
                    signOut();
                }}
            >
                Sign Out
            </button>
        </div>
    )
}

export default ProfileMenu;