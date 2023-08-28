import Post from "@/models/post";
import { connectToDB } from "@/utils/database";
import { getServerSession } from "next-auth";

interface CreatePostRequestProps {
    prompt: string,
    userId: string | null,
    tag: string
}

export const POST = async (req: any) => {
    const session = await getServerSession();
    
    if (!session)
        return new Response("Access denied", {
            status: 401
        })
        
    const { prompt, userId, tag }: CreatePostRequestProps = await req.json();

    try {
        await connectToDB();
        const newPrompt = new Post({ creator: userId, prompt, tag, timeStamp: Date.now() });
        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 201 })
    }
    catch (error) {
        return new Response("Failed to create prompt", { status: 500 })
    }
}