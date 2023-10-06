"use client"

import UserService from '@/utils/UserService'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface FormData {
    email: string,
    username: string,
    password: string
}

const Register = () => {
    const router = useRouter()
    const { status }: any = useSession()

    const [data, setData] = useState<FormData>({
        email: "",
        username: "",
        password: ""
    })

    const [dataError, setDataError] = useState<FormData>({
        email: "",
        username: "",
        password: ""
    })

    const [signupError, setSignupError] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const [registrationInProgess, setRegistrationInProgess] = useState<boolean>(false)

    const handleChange = (e: any) => {
        const field: keyof FormData = e.target.name;

        if (dataError[field])
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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleSubmit = async () => {
        setSignupError(false)

        const passwordLength = data.password.length
        const usernameLength = data.username.length

        const invalidEmail = !emailRegex.test(data.email);
        const isInvalidPassword = passwordLength < 7 || passwordLength > 20
        const isInvalidUsername = usernameLength < 7 || usernameLength > 20

        const formHasErrors = invalidEmail || isInvalidPassword || isInvalidUsername;

        if (isInvalidPassword) {
            setDataError(prev => ({
                ...prev,
                password: "Invalid Password. Password length must be 7-20 characters"
            }))
        }
        if (isInvalidUsername) {
            setDataError(prev => ({
                ...prev,
                username: "Invalid Username. Username length must be 7-20 characters"
            }))
        }
        if (invalidEmail) {
            setDataError(prev => ({
                ...prev,
                email: "Invalid email address"
            }))
        }

        if (formHasErrors)
            return
        setRegistrationInProgess(true)

        await UserService.registerUser({
            email: data.email,
            username: data.username,
            password: data.password
        })
            .then(() => {
                signIn('credentials',
                    {
                        email: data.email,
                        password: data.password,
                        redirect: false
                    })
                    router.push('/')
            })
            .catch((e) => {
                if (e.response?.data === "Email already exists") {
                    setDataError(prev => ({
                        ...prev,
                        email: e.response.data
                    }))
                }
                setSignupError(true)
            })
            .finally(() => {
                setRegistrationInProgess(false)
            })
    }

    const isLoginButtonDisabled = !(data.email && data.password && data.username)

    return (
        <div className='grid place-items-center h-screen'>
            <div className="flex flex-col gap-4 justify-center items-center w-96 shadow-xl border-slate-300 border-2 rounded-lg p-8 dark:shadow-stone-400/40 dark:border-stone-400">
                <div className="font-sedgwick text-3xl my-4">Promptbook</div>
                <form onSubmit={(e: any) => e.preventDefault()} className="space-y-6 w-full">
                    <div>
                        <label className='pb-1 text-blue-100'>Email</label>
                        <input
                            className="px-3 py-1.5 w-full"
                            name="email"
                            id="email"
                            value={data.email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                        />
                        {dataError.email ?
                            <span className="font-semibold text-red-400">
                                {dataError.email}
                            </span>
                            : <></>
                        }
                    </div>

                    <div>
                        <label className='pb-1 text-blue-100'>Username</label>
                        <input
                            className="px-3 py-1.5 w-full pr-8"
                            name="username"
                            id="username"
                            value={data.username}
                            placeholder="Enter your username"
                            onChange={handleChange}
                        />
                        {dataError.username ?
                            <span className="font-semibold text-red-400">
                                {dataError.username}
                            </span>
                            : <></>
                        }
                    </div>

                    <div>
                        <label className='pb-1 text-blue-100'>Password</label>
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
                    </div>

                    <button
                        className={`flex w-full justify-center rounded-xl ${isLoginButtonDisabled ? "bg-blue-500 opacity-40" : "bg-blue-500 opacity-100"} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${!isLoginButtonDisabled && "hover:bg-blue-700 "}  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
                        disabled={isLoginButtonDisabled}
                        onClick={handleSubmit}
                    >
                        {registrationInProgess ? "Registering" : "Register"}
                        {registrationInProgess ?
                            <div
                                data-testid="tid-spinner"
                                className="animate-spin h-5 w-5 mr-3 ml-4 border-slate-100 rounded-full border-solid border-t-4">
                            </div>
                            : null
                        }
                    </button>
                </form>
                <br />
                {signupError ?
                    <span className="flex w-full justify-center px-3 py-1.5 text-md font-semibold leading-6 text-red-400 shadow-sm">
                        Failed to login. Please try again!
                    </span>
                    : <></>
                }
            </div>
        </div>
    )
}

export default Register