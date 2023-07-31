import { render, screen, fireEvent } from "@testing-library/react"
import { SessionProvider } from "next-auth/react";
import "isomorphic-fetch"
import CreatePrompt from "../page"
import PromptService from "@/utils/PromptService";

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
        render(
            <SessionProvider session={null}>
                <CreatePrompt />
            </SessionProvider>
        );
        postSpy = jest.spyOn(PromptService, "postPrompt").mockResolvedValue({
            prompt: "",
            tag: ""
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    it("Should render the form to create a post", () => {
        jest.spyOn(PromptService, "postPrompt").mockResolvedValue({
            prompt: "",
            tag: ""
        })

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
            userId: undefined,
            tag: "s"
        })
    })
})