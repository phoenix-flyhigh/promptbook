import { CreatePromptRequest } from "@/app/create-prompt/page";
import axios from "axios";

interface PostPromptResponse {
    prompt: string,
    tag: string
}

interface IPromptService {
    postPrompt: (request: CreatePromptRequest) => Promise<PostPromptResponse>;
}

const PromptService: IPromptService = {
    postPrompt: async (request: CreatePromptRequest) => {
        const response = await axios.post("/api/prompt/new", 
            JSON.stringify(request),
        )
        
        return response.data
    }
}

export default PromptService;
