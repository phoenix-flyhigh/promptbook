"use client"

import Image from "next/image"
import Link from "next/link"
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import SignInSetup from "./SignInSetup";
import { UserDetailsFromSession } from "@/utils/AuthUtil";

interface NavBarViewProps {
    isUserLoggedIn: UserDetailsFromSession
}

const NavBarView: (props: NavBarViewProps) => JSX.Element = ({
    isUserLoggedIn
}: NavBarViewProps) => {
    const [toggleProfileMenu, setToggleProfileMenu] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const root = document.documentElement;

    useEffect(() => {
        setIsDarkTheme(root.classList.contains('dark'))
    }, [])

    const handleToggleTheme = () => {
        setIsDarkTheme(prev => !prev)
        root.classList.toggle('dark')
    }

    return (
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href="/" className="flex gap-2 flex-center" data-testid="tid-app-logo">
                <Image
                    src="/images/logo.svg"
                    alt="Promptbook logo"
                    width={30}
                    height={30}
                    className="object-contain"
                />
            </Link>
            {
                isUserLoggedIn ?
                    (
                        <>
                            <div className="sm:flex hidden">
                                <div className=" flex gap-3 md:gap-5">
                                    <Link href="/create-prompt" className="black_btn">
                                        Create Post
                                    </Link>
                                    <button type="button" onClick={() => signOut()} className="outline_btn">
                                        Sign Out
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleToggleTheme()
                                            setToggleProfileMenu(false)
                                        }}
                                        className="outline_btn">
                                        {`Switch to ${isDarkTheme ? "Light" : "Dark"} Theme`}
                                    </button>
                                    <Link href="/profile">
                                        <Image
                                            data-testid="tid-profile-icon-desktop"
                                            src={isUserLoggedIn.image ?? ""}
                                            alt="Profile photo"
                                            width={37}
                                            height={37}
                                            className="rounded-full"
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className="sm:hidden flex relative">
                                <div className="flex" >
                                    <Image
                                        data-testid="tid-profile-icon-mobile"
                                        src={isUserLoggedIn.image ?? ""}
                                        alt="Profile photo"
                                        width={37}
                                        height={37}
                                        className="rounded-full"
                                        onClick={() => setToggleProfileMenu((prev: boolean) => !prev)}
                                    />
                                    {
                                        toggleProfileMenu && (
                                            <div className="dropdown" data-testid="tid-nav-dropdown">
                                                <Link
                                                    href="/profile"
                                                    className="dropdown_link"
                                                    onClick={() => setToggleProfileMenu(false)}
                                                >
                                                    My Profile
                                                </Link>
                                                <Link
                                                    href="/create-prompt"
                                                    className="dropdown_link"
                                                    onClick={() => setToggleProfileMenu(false)}
                                                >
                                                    Create Post
                                                </Link>
                                                <p className="dropdown_link">
                                                    <span onClick={() => {
                                                        handleToggleTheme()
                                                        setToggleProfileMenu(false)
                                                    }}>
                                                        {`Switch to ${isDarkTheme ? "Light" : "Dark"} Theme`}
                                                    </span>
                                                </p>
                                                <button
                                                    type="button"
                                                    className="mt-5 w-full black_btn"
                                                    onClick={() => {
                                                        setToggleProfileMenu(false);
                                                        signOut();
                                                    }}
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </>
                    ) : <SignInSetup />
            }
        </nav>
    )
}

export default NavBarView