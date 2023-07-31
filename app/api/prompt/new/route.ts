import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/database";

interface CreatePostRequestProps {
    prompt: string,
    userId: string | null,
    tag: string
}

export const POST = async (req: any) => {
    const { prompt, userId, tag }: CreatePostRequestProps = await req.json();

    try {
        await connectToDB();
        const newPrompt = new Prompt({ creator: userId, prompt, tag });
        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 201 })
    }
    catch (error) {
        return new Response("Failed to create prompt", { status: 500 })
    }
}