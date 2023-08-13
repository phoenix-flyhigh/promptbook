"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Profile from "@/components/Profile";
import PromptService, { Post } from "@/utils/PromptService";
import UserService from "@/utils/UserService";
import { UseStateType } from "@/components/Feed/Feed.view";
import { useRouter } from "next/navigation";

const MyProfile = () => {
  const { data: session }: any = useSession();
  const router : any = useRouter();
  const [posts, setPosts]: UseStateType<Post[]> = useState([] as Post[]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await UserService.getPostsByUser(session?.user.id);
      setPosts(response);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post: Post) => { 
      router.push(`/update-prompt?id=${post._id}`)
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
      desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;