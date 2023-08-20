"use client";

import { useState } from "react";
import Image from "next/image";
import { Post } from "@/utils/PromptService";
import { UserDetailsFromSession } from "@/utils/AuthUtil";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface CardViewProps {
    post: Post,
    handleTagClick?: (tagName: string) => void,
    handleEdit?: (post: Post) => void,
    handleDelete?: (post: Post) => void
}

const CardView = ({
    post,
    handleTagClick,
    handleEdit,
    handleDelete
}: CardViewProps) => {

    const { data: session } = useSession();

    const pathName = usePathname();
    const [copied, setCopied] = useState("");

    const handleCopy = () => {
        setCopied(post.prompt);
        navigator.clipboard.writeText(post.prompt);
        setTimeout(() => setCopied(""), 3000);
    };
    const user: UserDetailsFromSession = session?.user;

    return (
        <div className='prompt_card' data-testid="tid-prompt-card">
            <div className='flex justify-between items-start gap-5'>
                <div
                    className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
                >
                    <Image
                        src={post.creator.image}
                        alt='user_image'
                        width={40}
                        height={40}
                        className='rounded-full object-contain'
                    />

                    <div className='flex flex-col'>
                        <h3 className='font-satoshi font-semibold text-gray-900 dark:text-stone-400'>
                            {post.creator.username}
                        </h3>
                        <p className='font-inter text-sm text-gray-500'>
                            {post.creator.email}
                        </p>
                    </div>
                </div>

                <div className='copy_btn' onClick={handleCopy}>
                    <Image
                        src={
                            copied === post.prompt
                                ? "/icons/tick.svg"
                                : "/icons/copy.svg"
                        }
                        alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
                        width={12}
                        height={12}
                    />
                </div>
            </div>

            <p className='my-4 font-satoshi text-sm text-gray-700 dark:text-slate-100'>{post.prompt}</p>
            <p
                className='font-inter text-sm blue_gradient cursor-pointer dark:text-blue-400'
                onClick={() => handleTagClick && handleTagClick(post.tag)}
            >
                #{post.tag}
            </p>
            {user?.id === post.creator._id && pathName === "/profile" && (
                <div className='mt-5 flex-end gap-4 border-t border-gray-100 pt-3'>
                    <button
                        className='font-inter text-sm green_gradient cursor-pointer'
                        onClick={handleEdit ? () => handleEdit(post) : () => {}}
                    >
                        Edit
                    </button>
                    <button
                        className='font-inter text-sm orange_gradient cursor-pointer'
                        onClick={handleDelete ? () => handleDelete(post) : () => {}}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default CardView;