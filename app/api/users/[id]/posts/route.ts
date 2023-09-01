import Post from "@/models/post";
import UserAccount from "@/models/userAccount";
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

        const posts = await Post.find({
            creator: params.id
        })
        .sort({timeStamp: -1})
        .populate('creator');

        const creator = await UserAccount.findById(params.id)

        const response = {
            creator: creator,
            posts: posts
        }

        return new Response(JSON.stringify(response), {
            status: 200
        })

    } catch (error) {
        return new Response("Failed to fetch posts", {
            status: 500
        })
    }
}