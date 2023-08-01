"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Profile from "@/components/Profile";
import { Post } from "@/utils/PromptService";
import UserService from "@/utils/UserService";
import { UseStateType } from "@/components/Feed/Feed.view";

const MyProfile = () => {
  const { data: session }: any = useSession();
  const [myPosts, setMyPosts]: UseStateType<Post[]> = useState([] as Post[]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await UserService.getPostsByUser(session?.user.id);
      setMyPosts(response);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post: Post) => {  };

  const handleDelete = async (post: Post) => {  };

  return (
    <Profile
      name='My'
      desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;