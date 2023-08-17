"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Profile from "@/components/Profile";
import PromptService, { Post } from "@/utils/PromptService";
import UserService from "@/utils/UserService";
import { UseStateType } from "@/components/Feed/Feed.view";
import { useRouter } from "next/navigation";

const MyProfile = () => {
  const { data: session, status }: any = useSession();
  const router: any = useRouter();
  const [posts, setPosts]: UseStateType<Post[]> = useState([] as Post[]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchPostsError, setFetchPostsError] = useState<boolean>(false);

  const fetchPosts = async () => {
    setIsLoading(true)
    await UserService.getPostsByUser(session?.user.id)
      .then((response) => {
        setPosts(response)
        setFetchPostsError(false)
      })
      .catch((e) => {
        setFetchPostsError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  };

  useEffect(() => {
    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (fetchPostsError) {
    return (
      <p>
        Failed to load posts
        <br />
        <button onClick={() => fetchPosts()}>Try again</button>
      </p>
    )
  }

  const handleEdit = (post: Post) => {
    router.push(`/update-post?id=${post._id}`)
  };

  const handleDelete = async (post: Post) => {
    try {
      await PromptService.deletePrompt(post._id)
      const myPosts = posts.filter(p => p._id !== post._id)
      setPosts(myPosts)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Profile
      name='My'
      desc={`Welcome to your personalized profile page. Share your 
      exceptional prompts and inspire others with the power of your imagination`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;