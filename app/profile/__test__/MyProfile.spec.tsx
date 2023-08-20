import { fireEvent, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"
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
    beforeEach(async () => {
        jest.spyOn(PromptService, "deletePrompt").mockResolvedValue("Successfully deleted")
        jest.spyOn(UserService, "getPostsByUser").mockResolvedValue([mockPostsResponse[1]])
        renderWithSession(<MyProfile />, {
            user: {
                id: "23"
            }
        })
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("Should render the feed for user profile", () => {
        expect(screen.getByText("My Profile")).toBeInTheDocument();
        expect(screen.getByText("First post")).toBeInTheDocument();
    })

    it("Should redirect on clicking edit button", () => {
        const editButton = screen.getByText("Edit")
        expect(editButton).toBeInTheDocument();

        fireEvent.click(editButton);

        expect(routerSpy).toHaveBeenCalled()
    })

    it("Should delete post on clicking delete button and show alert", async () => {
        const postToBeDeleted = screen.getByText("First post")
        expect(postToBeDeleted).toBeInTheDocument()
        const deleteButton = screen.getByRole("button", { name: "Delete" })

        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);
        await waitFor(() => {
            expect(screen.queryByTestId("tid-prompt-card")).not.toBeInTheDocument()
            expect(screen.queryByText("First post")).toBeNull()
        })
        expect(screen.getByText("Successfully deleted post")).toBeInTheDocument()
        const closeButton = screen.getByTitle("Close")
        fireEvent.click(closeButton)
        
        await waitFor(() => {
            expect(screen.queryByText("Successfully deleted post")).not.toBeInTheDocument()
        })
    })
})

describe("My profile page tests for not logged in users", () => {
    it("Should not render page data and show appropriate error message", () => {
        renderWithSession(<MyProfile />, null)

        expect(screen.getByText("Access Denied. Please sign in to view this page")).toBeInTheDocument()
        expect(screen.queryByText("My Profile")).not.toBeInTheDocument()
    })
})

describe("Fetch posts for user profile page tests", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("Should render loading text until fetch posts api call completes", async() => {
        jest.spyOn(UserService, "getPostsByUser").mockResolvedValue([mockPostsResponse[1]])
        renderWithSession(<MyProfile />, {
            user: {
                id: "23"
            }
        })

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
    })

    it("Should render loading text until fetch posts api call completes",async () => {
        const serviceSpy = jest.spyOn(UserService, "getPostsByUser").mockRejectedValue(new Error("error"))
        renderWithSession(<MyProfile />, {
            user: {
                id: "23"
            }
        })
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
        
        expect(screen.getByText("Failed to load posts")).toBeInTheDocument();
        expect(serviceSpy).toHaveBeenCalledTimes(1)
        
        const tryAgainButton = screen.getByRole("button", {name: "Try again"})
        fireEvent.click(tryAgainButton)
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))

        expect(serviceSpy).toHaveBeenCalledTimes(2)
    })

    it("Should show alert if failed to delete post on clicking delete button", async () => {
        const deleteServiceSpy = jest.spyOn(PromptService, "deletePrompt").mockRejectedValue(new Error("error"))
        jest.spyOn(UserService, "getPostsByUser").mockResolvedValue([mockPostsResponse[1]])
        renderWithSession(<MyProfile />, {
            user: {
                id: "23"
            }
        })
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
    
        const postToBeDeleted = screen.getByText("First post")
        expect(postToBeDeleted).toBeInTheDocument()
        const deleteButton = screen.getByRole("button", { name: "Delete" })

        fireEvent.click(deleteButton);
        await waitFor(() => {
            expect(screen.getByText("Failed to delete post! Please try again")).toBeInTheDocument()
        })
        const closeButton = screen.getByTitle("Close")
        fireEvent.click(closeButton)
        
        expect(deleteServiceSpy).toHaveBeenCalledTimes(1)
        await waitFor(() => {
            expect(screen.queryByText("Failed to delete post! Please try again")).not.toBeInTheDocument()
        })
    })
})
