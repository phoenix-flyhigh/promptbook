import AuthUtil from '@/utils/AuthUtil';
import NavBarView from './NavBar.view'

const NavBar: () => JSX.Element = () => {
    const isUserLoggedIn : boolean = AuthUtil.getIsUserLoggedIn();
    return (
        <NavBarView isUserLoggedIn={isUserLoggedIn}/>
    )
}

export default NavBar