import { Post } from "@/utils/PromptService"
import { useRouter } from "next/navigation";
import ProfileView from "./Profile.view"

export interface ProfileProps {
    name: string,
    desc: string,
    data: Post[],
    handleEdit: (post: Post) => void,
    handleDelete: (post: Post) => void,
    isLoggedInUserProfile: boolean
}

const Profile = ({
    name,
    desc,
    data,
    handleEdit,
    handleDelete,
    isLoggedInUserProfile
}: ProfileProps) => {
    const router = useRouter()

    const handleCreate = () => router.push("/create-post")

    return (
        <ProfileView
            name={name}
            desc={desc}
            data={data}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isLoggedInUserProfile={isLoggedInUserProfile}
            handleCreate={handleCreate}
        />
    )
}

export default Profile