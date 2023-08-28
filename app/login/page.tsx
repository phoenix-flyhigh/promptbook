"use client"
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface FormData {
    email: string,
    password: string
}

const Login = () => {
    const router = useRouter()
    const { data: session }: any = useSession()

    const [data, setData] = useState<FormData>({
        email: "",
        password: ""
    })

    const [dataError, setDataError] = useState<FormData>({
        email: "",
        password: ""
    })

    const [loginError, setLoginError] = useState<boolean>(false)

    const handleChange = (e: any) => {
        setDataError(prev => ({
            ...prev,
            [e.target.name]: ""
        }))

        setData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/')
        }
    }, [])

    const handleSubmit = (e: any) => {
        e.preventDefault()
        setLoginError(false)
        console.log("entered submit fn");

        const passwordLength = data.password.length

        console.log(passwordLength);

        if (passwordLength < 8 || passwordLength > 20) {
            setDataError(prev => ({
                ...prev,
                password: "Invalid Password"
            }))
            return
        }

        signIn('credentials',
            {
                ...data, redirect: false
            })
            .then((callback) => {
                if (callback?.error) {
                    if (callback?.error === "No user found") {
                        setDataError(prev => ({
                            ...prev,
                            email: "Invalid email or username"
                        }))
                    }
                    else if (callback?.error === "Incorrect password")
                        setDataError(prev => ({
                            ...prev,
                            password: "Incorrect password"
                        }))
                    else
                        setLoginError(true)
                }

                if (callback?.ok && !callback?.error) {
                    router.push("/")
                }
            })
    }

    return (
        <div className="flex flex-col gap-4 justify-center items-center w-72">
            <span>
                Login to Promptbook
            </span>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    className="px-3 py-1.5 w-full"
                    name="email"
                    id="email"
                    value={data.email}
                    placeholder="Enter your email or username"
                    onChange={handleChange}
                />
                {dataError.email ?
                    <span className="font-semibold text-red-400">
                        {dataError.email}
                    </span>
                    : <></>
                }

                <input
                    className="px-3 py-1.5 w-full"
                    name="password"
                    id="password"
                    value={data.password}
                    placeholder="Enter your password"
                    onChange={handleChange}
                />
                {dataError.password ?
                    <span className="font-semibold text-red-400">
                        {dataError.password}
                    </span>
                    : <></>
                }

                <button
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    type="submit"
                    disabled={!(data.email && data.password)}
                >
                    Log in
                </button>
                {loginError ?
                    <span className="flex w-full justify-center px-3 py-1.5 text-md font-semibold leading-6 text-red-400 shadow-sm">
                        Failed to login. Please try again!
                    </span>
                    : <></>
                }
            </form>
        </div>
    )
}

export default Login