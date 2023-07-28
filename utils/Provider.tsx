"use client"

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

interface ProviderProps {
    children: any;
    session?: Session | null | undefined
}

const Provider: (props: ProviderProps) => JSX.Element = ({ children, session }: ProviderProps) => {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}

export default Provider