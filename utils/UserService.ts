import axios from "axios"
import { Post, User } from "./PromptService";

export interface userProfileData {
    creator: User,
    posts: Post[]
}

export interface UserRegistrationDetails { 
    email: string, 
    username: string, 
    password: string
}

interface IUserService {
    getPostsByUser: (userId: string) => Promise<userProfileData>;
    registerUser : (req: UserRegistrationDetails) => Promise<string>;
}

const UserService: IUserService = {
    getPostsByUser : async (userId: string) => {
        const response = await axios.get(`/api/users/${userId}/posts`)
        return response.data
    },
    registerUser : async (userDetails: UserRegistrationDetails) => {
        const response = await axios.post("/api/users/register", userDetails)
        return response.data
    }
}

export default UserService;