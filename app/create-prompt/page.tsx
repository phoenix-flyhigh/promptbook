"use client"

import Form from '@/components/Form'
import Toast from '@/components/Toast'
import PromptService, { Post } from '@/utils/PromptService'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'

export interface CreatePromptRequest {
  prompt: string,
  userId: string | undefined,
  tag: string
}

const CreatePrompt = () => {
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

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  const createPrompt = async (e: MouseEvent) => {
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
    <div className="overlap_parent">
      <Toast
        message="Failed to create post. Please try again later"
        showToast={error}
        onClose={() => setError(false)}
      />
      <Form
        type="Create"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={createPrompt}
      />
    </div>
  )
}

export default CreatePrompt