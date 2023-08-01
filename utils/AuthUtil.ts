"use client"

import { useSession } from "next-auth/react";

export type UserDetailsFromSession =  {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    id?: string | null | undefined;
} | undefined;

interface IAuthUtil {
    getUserFromSession: () => UserDetailsFromSession;
}

const AuthUtil: IAuthUtil = {
    getUserFromSession: () => {
        const {data: session} = useSession();
        
        return session?.user
    }
}

export default AuthUtil;