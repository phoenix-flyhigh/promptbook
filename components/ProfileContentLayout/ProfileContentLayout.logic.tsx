import { Post } from "@/utils/PromptService"
import { useRouter } from "next/navigation";
import ProfileContentLayoutView from "./ProfileContentLayout.view"

export interface ProfileProps {
    name: string,
    desc: string,
    data: Post[],
    handleEdit: (post: Post) => void,
    handleDelete: (post: Post) => void,
    isLoggedInUserProfile: boolean
}

const ProfileContentLayout = ({
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
        <ProfileContentLayoutView
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

export default ProfileContentLayout