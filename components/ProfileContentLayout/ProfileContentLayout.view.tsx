"use client"

import Card from "@/components/Card";
import { useState } from "react";
import { ProfileProps } from "./ProfileContentLayout.logic";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { Post } from "@/utils/PromptService";
import Image from "next/image"

interface ProfileViewProps extends ProfileProps {
    isLoggedInUserProfile: boolean,
    handleCreate: () => void
}

const ProfileContentLayoutView = ({
    name,
    imageSrc,
    desc,
    data,
    handleEdit,
    handleDelete,
    isLoggedInUserProfile,
    handleCreate
}: ProfileViewProps) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [postToBeDeleted, setPostToBeDeleted] = useState<Post>({} as Post);

    return (
        <section className='w-full'>
            <h1 className='head_text text-left flex gap-4 items-end'>
                <Image
                    src={imageSrc}
                    width={80}
                    height={80}
                    alt="Profile photo"
                    className="bg-slate-300 dark:bg-slate-200 rounded-full"
                />
                <span className='blue_gradient'>{name} Profile</span>
            </h1>
            <p className='desc text-left'>{desc}</p>

            {!data.length ?
                (
                    <div className="flex justify-center flex-col items-center mt-10">
                        <p className="text-black text-4xl max-w-2xl dark:text-slate-200 font-bold"> No posts yet</p>
                        {isLoggedInUserProfile ?
                            (
                                <>
                                    <br />
                                    <p className="text-gray-900 text-lg max-w-2xl dark:text-slate-400">
                                        Start sharing by creating a post
                                    </p>
                                    <button className="black_btn mt-5" onClick={handleCreate}>
                                        Create Post
                                    </button>
                                </>
                            )
                            : <></>
                        }
                    </div>
                ) :
                <div className='mt-10 prompt_layout'>
                    <DeleteConfirmationDialog
                        isOpen={showDeleteDialog}
                        title="Delete Post"
                        description="Are you sure you want to delete the post. If deleted the post will be lost forever"
                        agreeBtnTitle="Delete"
                        disagreeBtnTitle="Cancel"
                        handleAgree={() => {
                            setShowDeleteDialog(false)
                            handleDelete(postToBeDeleted)
                            setPostToBeDeleted({} as Post)
                        }}
                        handleDisagree={() => {
                            setPostToBeDeleted({} as Post)
                            setShowDeleteDialog(false)
                        }}
                        handleClose={() => {
                            setPostToBeDeleted({} as Post)
                            setShowDeleteDialog(false)
                        }}
                    />
                    {data.map((post) => (
                        <Card
                            key={post._id}
                            post={post}
                            handleEdit={() => handleEdit(post)}
                            handleDelete={() => {
                                setPostToBeDeleted(post)
                                setShowDeleteDialog(true)
                            }}
                        />
                    ))}
                </div>
            }
        </section>
    );
};

export default ProfileContentLayoutView;