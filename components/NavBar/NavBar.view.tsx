"use client"

import Image from "next/image"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { UserDetailsFromSession } from "@/utils/AuthUtil";
import ThemeSwitcher from "../ThemeSwitcher";
import { useRouter } from "next/navigation";

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
                            <Image
                                data-testid="tid-profile-icon-mobile"
                                src={isUserLoggedIn.image?.length ? isUserLoggedIn.image : "/icons/profile-icon.svg"}
                                alt="Profile photo"
                                width={37}
                                height={37}
                                className="rounded-full dark:bg-slate-200 bg-slate-300 p-[2px]"
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