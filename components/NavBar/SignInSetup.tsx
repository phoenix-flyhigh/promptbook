"use client"

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

const SignInSetup = () => {
    const [providers, setProviders]: any = useState();

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response)
        }
        setUpProviders();
    }, [])
    return (providers ?
        <>
            {
                Object.values(providers).map((provider: any) => (
                    <button
                        type="button"
                        key={provider.name}
                        className="black_btn"
                        onClick={() => signIn(provider.id)}>
                        Sign In
                    </button>
                ))
            }
        </>
        :
        <></>
    )

}

export default SignInSetup