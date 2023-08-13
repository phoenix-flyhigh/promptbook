import { fireEvent, screen, waitFor } from "@testing-library/react"
import mockPostsResponse from "@/utils/TestData"
import renderWithSession from "@/utils/TestUtil"
import UserService from "@/utils/UserService"
import MyProfile from "../page"
import PromptService from "@/utils/PromptService"

const routerSpy = jest.fn()

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
        })),
        usePathname: jest.fn().mockReturnValue("/profile")
    };
});

describe("My profile page tests", () => {
    beforeEach(() => {
        jest.spyOn(PromptService, "deletePrompt").mockResolvedValue("Successfully deleted")
        jest.spyOn(UserService, "getPostsByUser").mockResolvedValue([mockPostsResponse[1]])
        renderWithSession(<MyProfile />, {
            user: {
                id: "23"
            }
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("Should render the feed for user profile", async () => {
        expect(screen.getByText("My Profile")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText("First post")).toBeInTheDocument();
        })
    })

    it("Should redirect on clicking edit button", async () => {
        await waitFor(() => {
            const editButton = screen.getByText("Edit")
            expect(editButton).toBeInTheDocument();

            fireEvent.click(editButton);
            expect(routerSpy).toHaveBeenCalled()
        })
    })

    it("Should delete post on clicking delete button", async () => {
        expect(screen.getByText("My Profile")).toBeInTheDocument();

        await waitFor(() => {
            const postToBeDeleted = screen.getByText("First post")
            expect(postToBeDeleted).toBeInTheDocument()
        })
        const editButton = screen.getByRole("button", { name: "Delete" })

        expect(editButton).toBeInTheDocument();

        fireEvent.click(editButton);
        await waitFor(() => {
            expect(screen.queryByTestId("tid-prompt-card")).not.toBeInTheDocument()
            expect(screen.queryByText("First post")).toBeNull()
        })
    })
})