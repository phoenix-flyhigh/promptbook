import PromptService from "@/utils/PromptService";
import mockPostsResponse from "@/utils/TestData";
import renderWithSession from "@/utils/TestUtil";
import { fireEvent, screen, waitFor } from "@testing-library/react"
import EditPrompt from "../page"

const routerSpy = jest.fn()

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
        })),
        useSearchParams: jest.fn().mockImplementation(() => ({
            get: (id: string) => "7"
        }))
    };
});

describe("Edit post page tests", () => {
    let updateServiceSpy: jest.SpyInstance;
    beforeEach(() => {
        updateServiceSpy = jest.spyOn(PromptService, "updatePrompt")
            .mockResolvedValue({
                ...mockPostsResponse[0],
                prompt: "New post"
            })
        jest.spyOn(PromptService, "getPrompt").mockResolvedValue(mockPostsResponse[0])
        renderWithSession(<EditPrompt />)
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("Should render the form with existing post data", async () => {
        expect(screen.getByText("Edit Post")).toBeInTheDocument();

        await waitFor(() => {
            const prompt = screen.getByText("This is a prompt")
            expect(prompt).toBeInTheDocument();
        })

        const tag = screen.getByDisplayValue("software")

        expect(tag).toBeInTheDocument();
    })

    it("Should make update api call and redirect to profile page", async () => {
        const editButton = screen.getByRole("button", {
            name: "Edit"
        })
        expect(editButton).toBeInTheDocument()
        await waitFor(() => {
            const prompt = screen.getByTestId("tid-prompt-input")
            expect(prompt).toBeInTheDocument();
            fireEvent.click(editButton)

            expect(updateServiceSpy).toHaveBeenCalled();
            expect(routerSpy).toHaveBeenCalled();
        })
    })
})

describe("Failed api call tests for update page", () => {
    it(`Should render toast when update post api call fails
        and close toast on clicking close btn`, async () => {
        const toastMessage = "Failed to update post. Please try again later"
        const updateServiceSpy = jest.spyOn(PromptService, "updatePrompt")
            .mockRejectedValue(new Error("internal error"))
        jest.spyOn(PromptService, "getPrompt").mockResolvedValue(mockPostsResponse[0])
        renderWithSession(<EditPrompt />)
        const editButton = screen.getByRole("button", {
            name: "Edit"
        })
        await waitFor(() => {
            const prompt = screen.getByTestId("tid-prompt-input")
            expect(prompt).toBeInTheDocument();
        })

        fireEvent.click(editButton)

        await waitFor(() => {
            expect(updateServiceSpy).toHaveBeenCalled();

            const toast = screen.getByText(toastMessage)
            expect(toast).toBeInTheDocument()
        })

        const closeButton = screen.getByTestId("tid-toast-close-btn")
        fireEvent.click(closeButton)

        expect(screen.queryByRole("alert")).not.toBeInTheDocument()
        expect(screen.queryByText(toastMessage)).not.toBeInTheDocument()
    })
})

describe("Update prompt page tests for not logged in users", () => {
    it("Should not render form show with appropriate error message", () => {
        renderWithSession(<EditPrompt />, null)

        expect(screen.getByText("Access Denied")).toBeInTheDocument()
        expect(screen.queryByText("Your AI Prompt")).not.toBeInTheDocument()
    })
})