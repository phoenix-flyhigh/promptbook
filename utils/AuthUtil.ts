"use client"

import { useSession } from "next-auth/react";

export type UserDetailsFromSession =  UserDetails | undefined;

export type UserDetails = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    id?: string | null | undefined;
}

interface IAuthUtil {
    useUserFromSession: () => UserDetailsFromSession;
}

const AuthUtil: IAuthUtil = {
    useUserFromSession: () => {
        const {data: session} = useSession();
        
        return session?.user
    }
}

export default AuthUtil;