interface IAuthUtil {
    getIsUserLoggedIn: () => boolean;
}

const AuthUtil: IAuthUtil = {
    getIsUserLoggedIn: () => {
        return true;
    }
}

export default AuthUtil;