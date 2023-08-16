"use client"

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

interface ProviderProps {
    children: any;
    session?: Session | null | undefined
}

const Provider: (props: ProviderProps) => JSX.Element = ({ children, session }: ProviderProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <SessionProvider session={session}>
                {children}
            </SessionProvider>
        );
    }

    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute="class" enableSystem={false}>
                {children}
            </ThemeProvider>
        </SessionProvider>
    )
}

export default Provider