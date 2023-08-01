import { Post } from "@/utils/PromptService"
import CardView from "./Card.view"

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
    return (
        <CardView
            post={post}
            handleTagClick={handleTagClick}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default Card