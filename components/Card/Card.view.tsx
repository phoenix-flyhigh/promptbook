"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { Post } from "@/utils/PromptService";
import { UserDetailsFromSession } from "@/utils/AuthUtil";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import formatTimeAgo from "@/utils/FormatTimestamp";
import { useTheme } from "next-themes";

interface CardViewProps {
    post: Post,
    handleTagClick?: (tagName: string) => void,
    handleEdit?: (post: Post) => void,
    handleDelete?: (post: Post) => void,
    truncatedText: string,
    showTruncatedContent: boolean,
    setShowTruncatedContent: Dispatch<SetStateAction<boolean>>
}

const CardView = ({
    post,
    handleTagClick,
    handleEdit,
    handleDelete,
    truncatedText,
    showTruncatedContent,
    setShowTruncatedContent
}: CardViewProps) => {

    const { data: session } = useSession();
    const router = useRouter();
    const pathName = usePathname();
    const [copied, setCopied] = useState("");
    const { theme } = useTheme();

    const handleCopy = () => {
        setCopied(post.prompt);
        navigator.clipboard.writeText(post.prompt);
        setTimeout(() => setCopied(""), 3000);
    };
    const user: UserDetailsFromSession = session?.user;
    const copyIconPath = theme === "dark" ? "/icons/copy-icon-dark.svg" : "/icons/copy-icon.svg";
    const tickIconPath = theme === "dark" ? "/icons/tick-icon-dark.svg" : "/icons/tick-icon.svg";

    const hasProfileImage = post.creator.image?.length
    return (
        <div className='prompt_card' data-testid="tid-prompt-card">
            <div className='flex justify-between items-start gap-5'>
                <div
                    data-testid="tid-author-section"
                    className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
                    onClick={() => router.push(`/profile?id=${post.creator._id}`)}
                >
                    <Image
                        src={hasProfileImage ? post.creator.image : "/icons/profile-icon.svg"}
                        alt='user_image'
                        width={40}
                        height={40}
                        className={`rounded-full object-contain ${!hasProfileImage && 'dark:bg-slate-200 p-[2px] bg-slate-300'}`}
                    />

                    <div className='flex flex-col'>
                        <h3 className='font-satoshi font-semibold text-gray-900 hover:text-blue-600 dark:hover:text-blue-400 dark:text-stone-200'>
                            {post.creator.username}
                        </h3>
                    </div>
                </div>

                <div className='copy_btn' onClick={handleCopy}>
                    <Image
                        src={copied === post.prompt ? tickIconPath : copyIconPath}
                        alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
                        width={20}
                        height={20}
                    />
                </div>
            </div>
            <div className="bg-gray-200 rounded-lg px-1 my-4 py-2 dark:bg-slate-800">
                <p className='font-satoshi text-lg text-gray-700 dark:text-slate-300 mb-4'>
                    {showTruncatedContent &&
                        <>
                            {truncatedText} <button
                                className="text-blue-500"
                                onClick={() => setShowTruncatedContent(prev => !prev)}
                            >
                                Show more
                            </button>
                        </>}
                    {!showTruncatedContent && truncatedText &&
                        <>
                            {post.prompt} <button
                                className="text-blue-500"
                                onClick={() => setShowTruncatedContent(prev => !prev)}
                            >
                                Show less
                            </button>
                        </>}
                    {!showTruncatedContent && !truncatedText && post.prompt}
                </p>
                <p
                    className='font-inter text-md blue_gradient cursor-pointer dark:text-blue-400'
                    onClick={() => handleTagClick && handleTagClick(post.tag)}
                >
                    {post.tag}
                </p>
            </div>
            {user?.id === post.creator._id && pathName.startsWith("/profile") && (
                <div className='mt-5 flex-end gap-4 pt-3'>
                    <button
                        className='font-inter text-md font-bold text-green-600 cursor-pointer'
                        onClick={handleEdit ? () => handleEdit(post) : () => { }}
                    >
                        Edit
                    </button>
                    <button
                        className='font-inter text-md font-bold text-red-600 cursor-pointer'
                        onClick={handleDelete ? () => handleDelete(post) : () => { }}
                    >
                        Delete
                    </button>
                </div>
            )}
            {post.timeStamp &&
                <div className="text-sm mt-2 dark:text-slate-500 text-zinc-500">
                    {formatTimeAgo(post.timeStamp)}
                </div>
            }
        </div>
    );
};

export default CardView;