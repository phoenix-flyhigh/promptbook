"use client"

import AuthUtil, { UserDetailsFromSession } from '@/utils/AuthUtil';
import NavBarView from './NavBar.view'

const NavBar: () => JSX.Element = () => {
    const isUserLoggedIn: UserDetailsFromSession = AuthUtil.getUserFromSession();
    return (
        <NavBarView isUserLoggedIn={isUserLoggedIn}/>
    )
}

export default NavBar