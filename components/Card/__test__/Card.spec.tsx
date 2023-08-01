import mockPostsResponse from "@/utils/TestData"
import { fireEvent, render , screen} from "@testing-library/react"
import Card from ".."

describe("Card component tests", () => {
    beforeEach(() => {
        Object.assign(navigator, {
            clipboard: {
              writeText: jest.fn(),
            },
          });
        render(<Card post={mockPostsResponse[0]} handleTagClick={() => {}}/>)
    })

    it("Should render the card component", () => {
        const userImage = screen.getByAltText("user_image")
        const username = screen.getByText("s")
        const email = screen.getByText("123@gmail.com")
        const prompt = screen.getByText("This is a prompt")
        const tag = screen.getByText("#software")
        const copyIcon = screen.getByAltText("copy_icon")

        expect(userImage).toBeInTheDocument()
        expect(username).toBeInTheDocument()
        expect(email).toBeInTheDocument()
        expect(prompt).toBeInTheDocument()
        expect(tag).toBeInTheDocument()
        expect(copyIcon).toBeInTheDocument()
    })

    it("Should render tick icon when user has copied a prompt", () => {
        const copyIcon = screen.getByAltText("copy_icon")

        fireEvent.click(copyIcon);

        expect(screen.getByAltText("tick_icon")).toBeInTheDocument()
        expect(screen.queryByAltText("copy_icon")).toBeNull()
    })
})