"use client"

import Form from '@/components/Form'
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
  const { data: session }: any = useSession();
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

  const createPrompt = async (e: MouseEvent) => {
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
      console.log(error);
    }
    finally {
      setSubmitting(false);
    }
  }

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  )
}

export default CreatePrompt