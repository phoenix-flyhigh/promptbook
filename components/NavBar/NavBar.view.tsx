"use client"

import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react";
import { useState } from "react";
import { UserDetailsFromSession } from "@/utils/AuthUtil";
import { useRouter } from "next/navigation";
import ThemeChangeButton from "../ThemeChangeButton";
import ProfileMenu from "../Dropdown";

interface NavBarViewProps {
    isUserLoggedIn: UserDetailsFromSession
}

const NavBarView: (props: NavBarViewProps) => JSX.Element = ({
    isUserLoggedIn
}: NavBarViewProps) => {
    const { data: session }: any = useSession();
    const [toggleProfileMenu, setToggleProfileMenu] = useState(false);
    const router = useRouter();

    return (
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href="/" className="flex gap-2 flex-center pt-3" data-testid="tid-app-logo">
                <div className="font-sedgwick text-3xl">Promptbook</div>

            </Link>
            {
                isUserLoggedIn ?
                    (
                        <div className="flex relative">
                            <ThemeChangeButton />
                            <Image
                                data-testid="tid-profile-icon-mobile"
                                src={isUserLoggedIn.image?.length ? isUserLoggedIn.image : "/icons/profile-icon.svg"}
                                alt="Profile photo"
                                width={37}
                                height={37}
                                className="rounded-full dark:bg-slate-200 bg-slate-300 p-[2px]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setToggleProfileMenu((prev: boolean) => !prev)
                                }}
                            />
                            {
                                toggleProfileMenu && (
                                    <ProfileMenu
                                        userId={session?.user.id}
                                        onClose={() => setToggleProfileMenu(false)}
                                    />
                                )}
                        </div>
                    ) : <>
                        <button
                            type="button"
                            className="black_btn"
                            onClick={() => router.push("/login")}>
                            Sign In
                        </button>
                    </>
            }
        </nav>
    )
}

export default NavBarView