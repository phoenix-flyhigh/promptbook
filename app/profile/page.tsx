"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import ProfileContentLayout from "@/components/ProfileContentLayout";
import PromptService, { Post } from "@/utils/PromptService";
import UserService from "@/utils/UserService";
import { UseStateType } from "@/components/Feed/Feed.view";
import { useRouter, useSearchParams } from "next/navigation";
import Snackbar from '@mui/material/Snackbar';
import React from "react";
import Alert from "@/components/Alert";
import LoadingAndErrorHandler from "@/components/LoadingAndErrorHandler";

const MyProfile = () => {
  const { data: session, status }: any = useSession();
  const router: any = useRouter();
  const [posts, setPosts]: UseStateType<Post[]> = useState([] as Post[]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchPostsError, setFetchPostsError] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    if (userId)
      await UserService.getPostsByUser(userId)
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
  }, [userId])

  useEffect(() => {
    if (userId) fetchPosts();
  }, [userId, fetchPosts]);

  const handleEdit = (post: Post) => {
    router.push(`/update-post?id=${post._id}`)
  };

  const handleDelete = async (post: Post) => {
    try {
      await PromptService.deletePrompt(post._id)
      const myPosts = posts.filter(p => p._id !== post._id)
      setPosts(myPosts)
      setShowSuccessToast(true)
    } catch (error) {
      setShowErrorToast(true)
    }
  };

  if (!userId) {
    return <p className="desc font-bold">Invalid Url. Please enter a valid user id</p>
  }

  return (
    <>
      <LoadingAndErrorHandler
        sessionStatus={status}
        loading={isLoading}
        error={fetchPostsError}
        errorMessage="Failed to load posts"
        retryCallback={fetchPosts}
      />
      {!isLoading && !fetchPostsError &&
        <>
          <Snackbar
            open={showSuccessToast}
            autoHideDuration={1000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setShowSuccessToast(false)} severity="success" sx={{ width: '100%' }}>
              Successfully deleted post
            </Alert>
          </Snackbar>
          <Snackbar
            open={showErrorToast}
            autoHideDuration={1000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setShowErrorToast(false)} severity="error" sx={{ width: '100%' }}>
              Failed to delete post! Please try again
            </Alert>
          </Snackbar>
          <ProfileContentLayout
            name='My'
            desc={`Welcome to your personalized profile page. Share your 
              exceptional prompts and inspire others with the power of your imagination`}
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isLoggedInUserProfile={session?.user.id === userId}
          />
        </>
      }
    </>
  );
};

export default MyProfile;