import axios from "axios"
import { Post, User } from "./PromptService";

export interface userProfileData {
    creator: User,
    posts: Post[]
}

interface IUserService {
    getPostsByUser: (userId: string) => Promise<userProfileData>;
}

const UserService: IUserService = {
    getPostsByUser : async (userId: string) => {
        const response = await axios.get(`/api/users/${userId}/posts`)
        return response.data
    }
}

export default UserService;