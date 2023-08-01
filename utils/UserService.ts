import axios from "axios"
import { Post } from "./PromptService";

interface IUserService {
    getPostsByUser: (userId: string) => Promise<Post[]>;
}

const UserService: IUserService = {
    getPostsByUser : async (userId: string) => {
        const response = await axios.get(`/api/users/${userId}/posts`)
        return response.data
    }
}

export default UserService;