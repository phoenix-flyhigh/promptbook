"use client"

import Image from "next/image"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import SignInSetup from "./SignInSetup";
import { UserDetailsFromSession } from "@/utils/AuthUtil";
import ThemeSwitcher from "../ThemeSwitcher";

interface NavBarViewProps {
    isUserLoggedIn: UserDetailsFromSession
}

const NavBarView: (props: NavBarViewProps) => JSX.Element = ({
    isUserLoggedIn
}: NavBarViewProps) => {
    const {data: session} : any = useSession();
    const [toggleProfileMenu, setToggleProfileMenu] = useState(false);

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
                        <div className="flex relative">
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
                                            href={`/profile?id=${session?.user.id}`}
                                            className="dropdown_link"
                                            onClick={() => setToggleProfileMenu(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/create-post"
                                            className="dropdown_link"
                                            onClick={() => setToggleProfileMenu(false)}
                                        >
                                            Create Post
                                        </Link>
                                        <p className="dropdown_link">
                                            <ThemeSwitcher onClick={() => setToggleProfileMenu(false)} />
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
                    ) : <SignInSetup />
            }
        </nav>
    )
}

export default NavBarView