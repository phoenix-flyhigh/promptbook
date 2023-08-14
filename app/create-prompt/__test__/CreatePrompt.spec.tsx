import { screen, fireEvent } from "@testing-library/react"
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
    let postSpy: jest.SpyInstance<any>;
    beforeEach(() => {
        postSpy = jest.spyOn(PromptService, "postPrompt").mockResolvedValue(mockPostsResponse[0]);
        renderWithSession(<CreatePrompt />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    it("Should render the form to create a post", () => {
        expect(screen.getByText("Your AI Prompt")).toBeInTheDocument()
    });

    it("Should redirect to home page if create post is successful", () => {
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
})

describe("Create prompt page tests for not logged in users", () => {
    it("Should not render form and show appropriate error message", () => {
        renderWithSession(<CreatePrompt />, null)

        expect(screen.getByText("Access Denied")).toBeInTheDocument()
        expect(screen.queryByText("Your AI Prompt")).not.toBeInTheDocument()
    })
})