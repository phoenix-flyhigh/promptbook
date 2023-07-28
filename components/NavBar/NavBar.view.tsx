"use client"

import Image from "next/image"
import Link from "next/link"
import { getProviders, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserDetailsFromSession } from "@/utils/AuthUtil";

interface NavBarViewProps {
    isUserLoggedIn: UserDetailsFromSession
}

const NavBarView: (props: NavBarViewProps) => JSX.Element = ({
    isUserLoggedIn
}: NavBarViewProps) => {
    const [providers, setProviders]: any = useState();

    const [toggleProfileMenu, setToggleProfileMenu] = useState(false);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response)
        }
        setUpProviders();
    }, [])


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
            <div className="sm:flex hidden">
                {
                    isUserLoggedIn ? (
                        <div className=" flex gap-3 md:gap-5">
                            <Link href="/create-prompt" className="black_btn">
                                Create Prompt
                            </Link>
                            <button type="button" onClick={() => signOut()} className="outline_btn">
                                Sign Out
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
                    ) :
                        (<> 
                        {providers && Object.values(providers).map((provider: any) => (
                                    <button
                                        type="button"
                                        key={provider.name}
                                        className="black_btn"
                                        onClick={() => signIn(provider.id)}>
                                        Sign In
                                    </button>
                                ))}
                                </>)
                }
            </div>

            <div className="sm:hidden flex relative">
                {
                    isUserLoggedIn ? (
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
                                            Create Prompt
                                        </Link>
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
                                )
                            }
                        </div>
                    ) : (<>
                    {providers && Object.values(providers).map((provider: any) => (
                                <button
                                    type="button"
                                    key={provider.name}
                                    className="black_btn"
                                    onClick={() => signIn(provider.id)}>
                                    Sign In
                                </button>
                            )
                            )}
                            </>)
                }
            </div>
        </nav>
    )
}

export default NavBarView