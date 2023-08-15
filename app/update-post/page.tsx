"use client"

import Form from '@/components/Form'
import Toast from '@/components/Toast'
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
    const [error, setError] = useState(false);
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

    if (!promptId) {
        return <p>Invalid Url. Please enter a valid prompt id</p>
    }

    const updatePrompt = async (e: MouseEvent) => {
        setError(false)
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
            setError(true)
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Toast
                message="Failed to update post. Please try again later"
                showToast={error}
                onClose={() => setError(false)}
            />
            <Form
                type="Edit"
                post={post}
                setPost={setPost}
                submitting={submitting}
                handleSubmit={updatePrompt}
            />
        </>
    )
}

export default EditPrompt