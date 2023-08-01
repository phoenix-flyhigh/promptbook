import { Post } from "@/utils/PromptService"
import CardView from "./Card.view"

interface CardProps {
    post: Post,
    handleTagClick: (tagName: string) => void
}

const Card: React.FC<CardProps> = ({
    post,
    handleTagClick
}: CardProps) => {
    return (
        <CardView post={post} handleTagClick={handleTagClick}/>
    )
}

export default Card