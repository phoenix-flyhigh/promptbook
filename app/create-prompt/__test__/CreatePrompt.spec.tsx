import { screen, fireEvent, waitFor } from "@testing-library/react"
import "isomorphic-fetch"
import CreatePrompt from "../page"
import PromptService from "@/utils/PromptService";
import renderWithSession from "@/utils/TestUtil";
import mockPostsResponse from "@/utils/TestData";

const routerSpy = jest.fn()

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
        }))
    };
});

describe("Create post page tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    it("Should render the form to create a post", () => {
        jest.spyOn(PromptService, "postPrompt").mockResolvedValue(mockPostsResponse[0]);
        renderWithSession(<CreatePrompt />);
        expect(screen.getByText("Your AI Prompt")).toBeInTheDocument()
    });

    it("Should redirect to home page if create post is successful", () => {
        const postSpy = jest.spyOn(PromptService, "postPrompt").mockResolvedValue(mockPostsResponse[0]);
        renderWithSession(<CreatePrompt />);
        const prompt = screen.getByTestId("tid-prompt-input")
        const tag = screen.getByTestId("tid-tag-input")
        const createButton = screen.getByText("Create")

        fireEvent.change(prompt, {
            target: {
                value: "s"
            }
        })
        fireEvent.change(tag, {
            target: {
                value: "s"
            }
        })
        fireEvent.click(createButton);

        expect(postSpy).toHaveBeenCalledWith({
            prompt: "s",
            userId: "7",
            tag: "s"
        })
    })

    it(`Should show error toast if the create api call fails
        and hide toast on clicking close button in toast`, async () => {
        const toastMessage = "Failed to create post. Please try again later"

        const postSpy = jest.spyOn(PromptService, "postPrompt").mockRejectedValue(new Error("internal error"));
        renderWithSession(<CreatePrompt />);
        const prompt = screen.getByTestId("tid-prompt-input")
        const tag = screen.getByTestId("tid-tag-input")
        const createButton = screen.getByText("Create")

        fireEvent.change(prompt, {
            target: {
                value: "s"
            }
        })
        fireEvent.change(tag, {
            target: {
                value: "s"
            }
        })
        fireEvent.click(createButton);

        expect(postSpy).toHaveBeenCalledWith({
            prompt: "s",
            userId: "7",
            tag: "s"
        })

        await waitFor(() => {
            const toastMessage = screen.getByText("Failed to create post. Please try again later")
            expect(toastMessage).toBeInTheDocument()
            expect(screen.queryByRole("alert")).toBeInTheDocument()

        })

        const closeButton = screen.getByTestId("tid-toast-close-btn")
        fireEvent.click(closeButton)

        expect(screen.queryByRole("alert")).not.toBeInTheDocument()
        expect(screen.queryByText(toastMessage)).not.toBeInTheDocument()
    })
})

describe("Create prompt page tests for not logged in users", () => {
    it("Should not render form and show appropriate error message", () => {
        renderWithSession(<CreatePrompt />, null)

        expect(screen.getByText("Access Denied")).toBeInTheDocument()
        expect(screen.queryByText("Your AI Prompt")).not.toBeInTheDocument()
    })
})