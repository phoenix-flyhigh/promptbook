import { CreatePromptRequest } from "@/app/create-prompt/page";
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
    tag: string
}

interface IPromptService {
    postPrompt: (request: CreatePromptRequest) => Promise<Post>;
    getPrompts: () => Promise<Post[]>;
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
    }
}

export default PromptService;
