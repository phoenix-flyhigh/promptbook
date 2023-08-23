import PromptService from "@/utils/PromptService"
import mockPostsResponse from "@/utils/TestData"
import renderWithSession from "@/utils/TestUtil"
import UserService from "@/utils/UserService"
import { waitForElementToBeRemoved, fireEvent, waitFor } from "@testing-library/dom"
import { screen } from "@testing-library/react";
import Profile from "../page"

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: jest.fn()
        })),
        usePathname: jest.fn().mockReturnValue("/profile"),
        useSearchParams: jest.fn().mockImplementation(() => ({
            get: (id: string) => "23"
        }))
    };
});


describe("Delete post in user profile tests", () => {
    let deleteServiceSpy: jest.SpyInstance;
    beforeEach(async () => {
        deleteServiceSpy = jest.spyOn(PromptService, "deletePrompt").mockResolvedValue("Successfully deleted")
        jest.spyOn(UserService, "getPostsByUser").mockResolvedValue({
            creator: {
                _id: "23", username: "sam", email: "", image: ""
            },
            posts: [mockPostsResponse[1]]
        })
        renderWithSession(<Profile />, {
            user: {
                id: "23"
            }
        })
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it(`Should delete post on clicking delete button 
        and confirms delete in the dialog and then
        show alert on successful delete`, async () => {

        const postToBeDeleted = screen.getByText("First post")
        expect(postToBeDeleted).toBeInTheDocument()
        const deleteButton = screen.getByRole("button", { name: "Delete" })

        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        expect(screen.getByRole("dialog")).toBeInTheDocument()
        const deleteBtn = screen.getByRole("button", { name: "Delete" })

        expect(deleteBtn).toBeInTheDocument()
        fireEvent.click(deleteBtn)

        expect(deleteServiceSpy).toHaveBeenCalledTimes(1)
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

    it(`Should not delete post on clicking delete button 
        and cancels delete in the dialog`, async () => {
        const postToBeDeleted = screen.getByText("First post")
        expect(postToBeDeleted).toBeInTheDocument()
        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton);

        expect(screen.getByRole("dialog")).toBeInTheDocument()

        const cancelBtn = screen.getByRole("button", { name: "Cancel" })

        expect(cancelBtn).toBeInTheDocument()

        fireEvent.click(cancelBtn)

        expect(deleteServiceSpy).toHaveBeenCalledTimes(0)
        expect(screen.getByTestId("tid-prompt-card")).toBeInTheDocument()
        expect(screen.getByText("First post")).toBeInTheDocument()
    })

    it(`Should not delete post on clicking delete button 
        and user clicks outside the dialog`, async () => {
        const postToBeDeleted = screen.getByText("First post")
        expect(postToBeDeleted).toBeInTheDocument()
        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton);

        expect(screen.getByRole("dialog")).toBeInTheDocument()

        const outsideContent = screen.getByText("sam's Profile")

        fireEvent.click(outsideContent)

        expect(deleteServiceSpy).toHaveBeenCalledTimes(0)
        expect(screen.getByTestId("tid-prompt-card")).toBeInTheDocument()
        expect(screen.getByText("First post")).toBeInTheDocument()
    })
})