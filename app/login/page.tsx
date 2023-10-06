"use client"
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface FormData {
    email: string,
    password: string
}

interface LoggingInProgress {
    email: boolean;
    google: boolean;
}

const Login = () => {
    const router = useRouter()
    const { status }: any = useSession()

    const [data, setData] = useState<FormData>({
        email: "",
        password: ""
    })

    const [dataError, setDataError] = useState<FormData>({
        email: "",
        password: ""
    })

    const [loginError, setLoginError] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const [loggingInProgess, setLoggingInProgess] = useState<LoggingInProgress>({
        email: false,
        google: false
    })

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
        if (status === 'authenticated') {
            router.push('/')
        }
    })

    const handleSubmit = () => {
        setLoginError(false)

        const passwordLength = data.password.length

        if (passwordLength < 7 || passwordLength > 20) {
            setDataError(prev => ({
                ...prev,
                password: "Invalid Password. Password length must be 7-20 characters"
            }))
            return
        }
        setLoggingInProgess(prev => ({
            ...prev,
            email: true
        }))

        signIn('credentials',
            {
                ...data, redirect: false
            })
            .then((callback) => {
                setLoggingInProgess(prev => ({
                    ...prev,
                    email: false
                }))
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

    const isLoginButtonDisabled = !(data.email && data.password)

    return (
        <div className='grid place-items-center h-screen'>
            <div className="flex flex-col gap-4 justify-center items-center w-96 shadow-xl border-slate-300 border-2 rounded-lg p-8 dark:shadow-stone-400/40 dark:border-stone-400">
                <div className="font-sedgwick text-3xl my-4">Promptbook</div>
                <form onSubmit={(e: any) => e.preventDefault()} className="space-y-6 w-full">
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
                    <div className='relative'>
                        <input
                            className="px-3 py-1.5 w-full pr-8"
                            name="password"
                            id="password"
                            value={data.password}
                            placeholder="Enter your password"
                            onChange={handleChange}
                            type={showPassword ? 'text' : 'password'}
                        />
                        {data.password.length ?
                            <button
                                className='absolute top-1/2 transform -translate-y-1/2 right-4'
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                            :
                            null
                        }
                    </div>
                    {dataError.password ?
                        <span className="font-semibold text-red-400">
                            {dataError.password}
                        </span>
                        : <></>
                    }
                    <button
                        className={`flex w-full justify-center rounded-xl ${isLoginButtonDisabled ? "bg-blue-500 opacity-40" : "bg-blue-500 opacity-100"} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${!isLoginButtonDisabled && "hover:bg-blue-700 "}  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
                        disabled={isLoginButtonDisabled}
                        onClick={handleSubmit}
                    >
                        {loggingInProgess.email ? "Logging in" : "Log in"}
                        {loggingInProgess.email ?
                            <div
                                data-testid="tid-spinner"
                                className="animate-spin h-5 w-5 mr-3 ml-4 border-slate-100 rounded-full border-solid border-t-4">
                            </div>
                            : null
                        }
                    </button>
                </form>
                <button
                    className='text-blue-600 dark:text-blue-400 text-sm'
                    onClick={() => router.push('/register')}
                >
                    New user? Register here
                </button>
                <div className=" flex items-center justify-center dark:text-blue-300 text-blue-800 text-md">
                    OR
                </div>
                <div
                    className="flex items-center justify-center dark:text-red-400 text-red-600 text-lg hover:cursor-pointer"
                >
                    <button
                        className='flex w-full justify-center items-center'
                        onClick={(e: any) => {
                            e.preventDefault()
                            setLoggingInProgess(prev => ({
                                ...prev,
                                google: true
                            }))
                            signIn('google')
                                .then(() => router.push('/'))
                                .catch(() => {
                                    setLoginError(true)
                                })
                                .finally(() => {
                                    setLoggingInProgess(prev => ({
                                        ...prev,
                                        google: false
                                    }))
                                })
                        }}
                    >
                        {loggingInProgess.google ? "Logging in with Google" : "Log in with Google"}
                        {loggingInProgess.google ?
                            <div
                                data-testid="tid-spinner"
                                className="animate-spin h-5 w-5 mr-3 ml-4 border-red-500 rounded-full border-2 border-t-4">
                            </div>
                            : null
                        }
                    </button>
                </div>
                <br />
                {loginError ?
                    <span className="flex w-full justify-center px-3 py-1.5 text-md font-semibold leading-6 text-red-400 shadow-sm">
                        Failed to login. Please try again!
                    </span>
                    : <></>
                }
            </div>
        </div>
    )
}

export default Login