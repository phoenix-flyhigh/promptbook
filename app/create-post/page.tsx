"use client"

import Form from '@/components/Form'
import PromptService, { Post } from '@/utils/PromptService'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import Snackbar from '@mui/material/Snackbar';
import Alert from "@/components/Alert";
import LoadingAndErrorHandler from "@/components/LoadingAndErrorHandler";

export interface CreatePromptRequest {
  prompt: string,
  userId: string | undefined,
  tag: string
}

const CreatePost = () => {
  const router = useRouter();
  const { data: session, status }: any = useSession();
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

  const createPost = async (e: MouseEvent) => {
    setError(false)
    e.preventDefault();
    setSubmitting(true);

    try {
      await PromptService.postPrompt({
        prompt: post.prompt,
        userId: session?.user.id,
        tag: post.tag,
      })
      router.push("/");
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
        loading={false}
        error={false}
        errorMessage=""
        retryCallback={() => { }}
      />
      {status === "authenticated" &&
        <>
          <Snackbar
            open={error}
            autoHideDuration={1000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
              Failed to create post. Please try again later
            </Alert>
          </Snackbar>
          <Form
            type="Create"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={createPost}
          />
        </>
      }
    </>
  )
}

export default CreatePost