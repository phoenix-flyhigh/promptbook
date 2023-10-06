"use client"

import Form from '@/components/Form'
import PromptService, { Post } from '@/utils/PromptService'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Snackbar from '@mui/material/Snackbar';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import Alert from "@/components/Alert";
import LoadingAndErrorHandler from "@/components/LoadingAndErrorHandler";

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
        return <p className="desc font-bold">Invalid Url. Please enter a valid prompt id</p>
    }

    const updatePrompt = async (e: MouseEvent) => {
        setError(false)
        e.preventDefault();
        setSubmitting(true);

        try {
            await PromptService.updatePrompt(post._id, {
                prompt: post.prompt.trim(),
                tag: post.tag.trim(),
            })
            router.push(`/profile?id=${session?.user.id}`);
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
            <LoadingAndErrorHandler
                sessionStatus={status}
                loading={isLoading}
                error={loadError}
                errorMessage="Failed to load post"
                retryCallback={getPromptDetails}
            />
            <Snackbar
                open={error}
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