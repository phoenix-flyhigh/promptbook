"use client"

import Form from '@/components/Form'
import PromptService, { Post } from '@/utils/PromptService'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Snackbar from '@mui/material/Snackbar';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import Alert from "@/components/Alert";

export interface UpdatePromptRequest {
    prompt: string,
    tag: string
}

const EditPrompt = () => {
    const { data: session, status }: any = useSession();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
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

    const getPromptDetails = useCallback(async () => {
        setIsLoading(true)
        setLoadError(false)
        try {
            if (promptId) {
                const post = await PromptService.getPrompt(promptId)
                setPost(post)
            }
        } catch (error) {
            setLoadError(true)
        } finally {
            setIsLoading(false)
        }
    }, [promptId])

    useEffect(() => {
        if (promptId && session?.user.id)
            getPromptDetails()
    }, [promptId, session?.user.id, getPromptDetails])

    if (!promptId) {
        return <p>Invalid Url. Please enter a valid prompt id</p>
    }

    if (status === "loading") {
        return <p>Loading...</p>
    }

    if (status === "unauthenticated") {
        return <p>Access Denied</p>
    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (loadError) {
        return (
            <p>
                Failed to load post
                <br />
                <button onClick={() => getPromptDetails()}>Try again</button>
            </p>
        )
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
            <Snackbar
                open={error}
                autoHideDuration={1000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
                    Failed to update post. Please try again later
                </Alert>
            </Snackbar>
            {!isLoading && !loadError &&
                <Form
                    type="Edit"
                    post={post}
                    setPost={setPost}
                    submitting={submitting}
                    handleSubmit={updatePrompt}
                />
            }
        </>
    )
}

export default EditPrompt