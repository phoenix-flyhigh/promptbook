"use client"

import { Post } from "@/utils/PromptService"
import CardView from "./Card.view"
import { useEffect, useState } from "react";

interface CardProps {
    post: Post,
    handleTagClick?: (tagName: string) => void,
    handleEdit?: (post: Post) => void,
    handleDelete?: (post: Post) => void
}

const Card: React.FC<CardProps> = ({
    post,
    handleTagClick,
    handleEdit,
    handleDelete
}: CardProps) => {
    const [showTruncatedContent, setShowTruncatedContent] = useState<boolean>(false);
    const [truncatedContent, setTruncatedContent] = useState<string>("");
    const maxWordCount = 25;
    
    useEffect(() => {
        const words = post.prompt.split(" ");
        const wordCount = words.length;

        if (wordCount > maxWordCount){
            setShowTruncatedContent(true)
            setTruncatedContent(words.slice(0, 20).join(" "))
        }
         else if (post.prompt.length > 250) {
             setShowTruncatedContent(true)
            setTruncatedContent(post.prompt.slice(0, 200))
         }
    }, [post.prompt])

    return (
        <CardView
            post={post}
            handleTagClick={handleTagClick}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            truncatedText={truncatedContent}
            showTruncatedContent={showTruncatedContent}
            setShowTruncatedContent={setShowTruncatedContent}
        />
    )
}

export default Card