import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/database"
import { getServerSession } from "next-auth/next";

type ParamsType = {
    params: {
        id: string
    }
}

export const GET = async (req: any, { params }: ParamsType) => {
    const session = await getServerSession();
    
    if (!session)
        return new Response("Access denied", {
            status: 401
        })
        
    try {
        await connectToDB();

        const posts = await Prompt.find({
            creator: params.id
        }).populate('creator');

        return new Response(JSON.stringify(posts), {
            status: 200
        })

    } catch (error) {
        return new Response("Failed to fetch posts", {
            status: 500
        })
    }
}