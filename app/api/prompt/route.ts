import Post from "@/models/post";
import { connectToDB } from "@/utils/database"

export const revalidate = 0

export const GET = async () => {
    try {
        await connectToDB();
        const prompts = await Post.find({}).populate('creator')
        return new Response(JSON.stringify(prompts), {
            status: 200
        })
    } catch (error) {
        return new Response("Failed to fetch posts", {
            status: 500
        })
    }
}