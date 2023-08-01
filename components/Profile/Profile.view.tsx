import { Post } from "@/utils/PromptService";
import Card from "@/components/Card";

interface ProfileViewProps {
    name: string,
    desc: string,
    data: Post[],
    handleEdit: (post: Post) => void,
    handleDelete: (post: Post) => void
}

const ProfileView = ({ name, desc, data, handleEdit, handleDelete }: ProfileViewProps) => {
    return (
        <section className='w-full'>
            <h1 className='head_text text-left'>
                <span className='blue_gradient'>{name} Profile</span>
            </h1>
            <p className='desc text-left'>{desc}</p>

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
        </section>
    );
};

export default ProfileView;