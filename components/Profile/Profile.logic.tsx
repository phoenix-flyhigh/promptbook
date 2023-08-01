import { Post } from "@/utils/PromptService"
import ProfileView from "./Profile.view"

interface ProfileProps {
    name: string,
    desc: string,
    data: Post[],
    handleEdit: (post: Post) => void,
    handleDelete: (post: Post) => void
}

const Profile = ({ name, desc, data, handleEdit, handleDelete }: ProfileProps) => {
    return (
        <ProfileView
            name={name}
            desc={desc}
            data={data}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default Profile