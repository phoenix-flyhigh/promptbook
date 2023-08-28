import { CreatePromptRequest } from "@/app/create-post/page";
import axios from "axios";

export interface User {
    username: string,
    email: string,
    image:string,
    _id: string
}

export interface Post {
    creator: User,
    prompt: string,
    _id: string,
    tag: string,
    timeStamp?: Date
}

interface IPromptService {
    postPrompt: (request: CreatePromptRequest) => Promise<Post>;
    getPrompts: () => Promise<Post[]>;
    getPrompt: (id:  string) => Promise<Post>;
    updatePrompt: (id: string, post: {
        prompt:string,
        tag: string
    }) => Promise<Post>;
    deletePrompt: (id:  string) => Promise<string>;
}

const PromptService: IPromptService = {
    postPrompt: async (request: CreatePromptRequest) => {
        const response = await axios.post("/api/prompt/new",
            JSON.stringify(request),
        )
        return response.data
    },
    getPrompts: async () => {
        const response = await axios.get("/api/prompt")
        return response.data
    },
    getPrompt: async (id: string) => {
        const response = await axios.get(`/api/prompt/${id}`)
        return response.data
    },
    updatePrompt: async (id: string, post: {
        prompt:string,
        tag: string
    }) => {
        const response = await axios.patch(`/api/prompt/${id}`,
            post,
        )
        return response.data
    },
    deletePrompt: async (id: string) => {
        const response = await axios.delete(`/api/prompt/${id}`)
        return response.data
    }
}

export default PromptService;
