"use client"
import PromptService, { Post } from '@/utils/PromptService';
import React, { useEffect, useState } from 'react'
import LoadingAndErrorHandler from '@/components/LoadingAndErrorHandler';
import FeedView from './Feed.view'

const Feed: () => JSX.Element = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const fetchPosts = async () => {
        setLoading(true)
        await PromptService.getPrompts()
            .then((response) => {
                setPosts(response);
                setError(false)
            })
            .catch((e) => {
                setError(true)
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return posts.length ? (
        <FeedView posts={posts} />
    ) :
        <>
            <br />
            <LoadingAndErrorHandler
                sessionStatus={null}
                loading={loading}
                error={error}
                errorMessage="Failed to load posts"
                retryCallback={fetchPosts}
            />
        </>

}

export default Feed