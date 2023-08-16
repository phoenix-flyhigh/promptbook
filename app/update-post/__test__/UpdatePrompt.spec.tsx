import PromptService from "@/utils/PromptService";
import mockPostsResponse from "@/utils/TestData";
import renderWithSession from "@/utils/TestUtil";
import { fireEvent, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"
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
    beforeEach(async () => {
        updateServiceSpy = jest.spyOn(PromptService, "updatePrompt")
            .mockResolvedValue({
                ...mockPostsResponse[0],
                prompt: "New post"
            })
        jest.spyOn(PromptService, "getPrompt").mockResolvedValue(mockPostsResponse[0])
        renderWithSession(<EditPrompt />)
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("Should render the form with existing post data", async () => {
        expect(screen.getByText("Edit Post")).toBeInTheDocument();
        const prompt = screen.getByText("This is a prompt")
        const tag = screen.getByDisplayValue("software")

        expect(prompt).toBeInTheDocument();
        expect(tag).toBeInTheDocument();
    })

    it("Should make update api call and redirect to profile page", async () => {
        const editButton = screen.getByRole("button", {
            name: "Edit"
        })
        const prompt = screen.getByTestId("tid-prompt-input")
        expect(prompt).toBeInTheDocument();

        fireEvent.click(editButton)

        await waitFor(() => {
            expect(updateServiceSpy).toHaveBeenCalled();
            expect(routerSpy).toHaveBeenCalled();
        })
    })
})

describe("Failed api call tests for update page", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it(`Should render toast when update post api call fails
        and close toast on clicking close btn`, async () => {
        const toastMessage = "Failed to update post. Please try again later"
        const updateServiceSpy = jest.spyOn(PromptService, "updatePrompt")
            .mockRejectedValue(new Error("internal error"))
        jest.spyOn(PromptService, "getPrompt").mockResolvedValue(mockPostsResponse[0])

        renderWithSession(<EditPrompt />)
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))

        const editButton = screen.getByRole("button", {
            name: "Edit"
        })
        const prompt = screen.getByTestId("tid-prompt-input")
        expect(prompt).toBeInTheDocument();

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

    it("Should render loading text until get api call finishes", () => {
        jest.spyOn(PromptService, "getPrompt").mockResolvedValue(mockPostsResponse[0])

        renderWithSession(<EditPrompt />)

        expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("Should render error message and try again button on get api failure", async () => {
        const serviceSpy = jest.spyOn(PromptService, "getPrompt").mockRejectedValue(new Error("error"))

        renderWithSession(<EditPrompt />)
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
        expect(screen.getByText("Failed to load post")).toBeInTheDocument()
        expect(serviceSpy).toHaveBeenCalledTimes(1)
        
        const tryAgainButton = screen.getByRole("button", {name: "Try again"})
        fireEvent.click(tryAgainButton)
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
        expect(serviceSpy).toHaveBeenCalledTimes(2)
    })
})

describe("Update prompt page tests for not logged in users", () => {
    it("Should not render form show with appropriate error message", () => {
        renderWithSession(<EditPrompt />, null)

        expect(screen.getByText("Access Denied")).toBeInTheDocument()
        expect(screen.queryByText("Your AI Prompt")).not.toBeInTheDocument()
    })
})