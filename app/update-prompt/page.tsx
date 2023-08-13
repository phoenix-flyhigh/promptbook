"use client"

import Form from '@/components/Form'
import PromptService, { Post } from '@/utils/PromptService'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export interface UpdatePromptRequest {
    prompt: string,
    tag: string
}

const EditPrompt = () => {
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
        if (promptId)
            getPromptDetails()
    }, [promptId])

    const updatePrompt = async (e: MouseEvent) => {
        console.log("clicked edit");
        
        e.preventDefault();
        setSubmitting(true);

        try {
            console.log("entered try");
            console.log(post.prompt);
            
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