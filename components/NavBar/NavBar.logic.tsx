"use client"

import AuthUtil, { UserDetailsFromSession } from '@/utils/AuthUtil';
import NavBarView from './NavBar.view'
import { usePathname } from 'next/navigation';

const NavBar: () => JSX.Element = () => {
    const isUserLoggedIn: UserDetailsFromSession = AuthUtil.getUserFromSession();
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return isLoginPage ?
        <></>
        :
        <NavBarView isUserLoggedIn={isUserLoggedIn} />

}

export default NavBar