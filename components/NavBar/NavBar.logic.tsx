"use client"

import AuthUtil, { UserDetailsFromSession } from '@/utils/AuthUtil';
import NavBarView from './NavBar.view'
import { usePathname } from 'next/navigation';

const NavBar: () => JSX.Element = () => {
    const isUserLoggedIn: UserDetailsFromSession = AuthUtil.useUserFromSession();
    const pathname = usePathname();
    const shouldNotRenderNav = (pathname === '/login') || (pathname === '/register');

    return shouldNotRenderNav ?
        <></>
        :
        <NavBarView isUserLoggedIn={isUserLoggedIn} />

}

export default NavBar