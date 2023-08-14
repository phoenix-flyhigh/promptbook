import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/database"
import { getServerSession } from "next-auth/next";

export const GET = async (req: any, { params }: {
    params: { id: string }
}) => {
    const session = await getServerSession();

    if (!session)
        return new Response("Access denied", {
            status: 401
        })

    try {
        await connectToDB();
        const prompt = await Prompt.findById(params.id).populate('creator');

        if (!prompt)
            return new Response("Prompt not found", {
                status: 404
            })

        return new Response(JSON.stringify(prompt), {
            status: 200
        })
    } catch (error) {
        return new Response("Internal server error", {
            status: 500
        })
    }
}

export const PATCH = async (
    req: any,
    { params }: {
        params: { id: string }
    }) => {
    const session = await getServerSession();

    if (!session)
        return new Response("Access denied", {
            status: 401
        })

    const { prompt, tag } = await req.json();
    try {
        await connectToDB();

        const existingPrompt = await Prompt.findById(params.id).populate("creator")

        if (!existingPrompt)
            return new Response("Prompt not found", {
                status: 404
            })

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), {
            status: 200
        })
    } catch (error) {
        return new Response("Could not update post due to internal server error", {
            status: 500
        })
    }
}

export const DELETE = async (req: any, { params }: {
    params: { id: string }
}) => {
    const session = await getServerSession();

    if (!session)
        return new Response("Access denied", {
            status: 401
        })
    try {
        await connectToDB();

        await Prompt.findByIdAndRemove(params.id)
        return new Response("Deleted post successfully", {
            status: 200
        })
    } catch (error) {
        return new Response("Could not delete post due to internal server error", {
            status: 500
        })
    }
}
