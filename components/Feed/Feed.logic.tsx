"use client"
import PromptService, { Post } from '@/utils/PromptService';
import React, { useEffect, useState } from 'react'
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

    if (loading)
        return (<p>Loading...</p>)
    if (error)
        return (
            <p>
                Failed to load posts
                <br/>
                <button onClick={() => fetchPosts()}>Try again</button>
            </p>
        )
    return posts.length ? (
        <FeedView posts={posts} />
    ): <></>

}

export default Feed