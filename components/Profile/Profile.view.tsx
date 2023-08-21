import { Post } from "@/utils/PromptService";
import Card from "@/components/Card";
import { ProfileProps } from "./Profile.logic";

interface ProfileViewProps extends ProfileProps {
    isLoggedInUserProfile: boolean,
    handleCreate: () => void
}

const ProfileView = ({
    name,
    desc,
    data,
    handleEdit,
    handleDelete,
    isLoggedInUserProfile,
    handleCreate
}: ProfileViewProps) => {
    return (
        <section className='w-full'>
            <h1 className='head_text text-left'>
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
                    {data.map((post) => (
                        <Card
                            key={post._id}
                            post={post}
                            handleEdit={() => handleEdit(post)}
                            handleDelete={() => handleDelete(post)}
                        />
                    ))}
                </div>
            }
        </section>
    );
};

export default ProfileView;