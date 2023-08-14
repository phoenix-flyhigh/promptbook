"use client"

import Form from '@/components/Form'
import PromptService, { Post } from '@/utils/PromptService'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export interface UpdatePromptRequest {
    prompt: string,
    tag: string
}

const EditPrompt = () => {
    const { data: session, status }: any = useSession();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [post, setPost]: [Post, Dispatch<SetStateAction<Post>>] = useState({
        prompt: "",
        tag: "",
        creator: {
            username: "",
            email: "",
            image: "",
            _id: ""
        },
        _id: ""
    })
    const searchParams = useSearchParams();
    const promptId = searchParams.get("id");

    useEffect(() => {
        const getPromptDetails = async () => {
            try {
                if (promptId) {
                    const post = await PromptService.getPrompt(promptId)
                    setPost(post)
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (promptId && session?.user.id)
            getPromptDetails()
    }, [promptId])

    if (status === "loading") {
        return <p>Loading...</p>
    }

    if (status === "unauthenticated") {
        return <p>Access Denied</p>
    }

    if(!promptId){
        return <p>Invalid Url. Please enter a valid prompt id</p>
    }

    const updatePrompt = async (e: MouseEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await PromptService.updatePrompt(post._id, {
                prompt: post.prompt,
                tag: post.tag,
            })
            router.push("/profile");
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <Form
            type="Edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={updatePrompt}
        />
    )
}

export default EditPrompt