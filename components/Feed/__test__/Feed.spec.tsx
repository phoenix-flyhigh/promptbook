import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Feed from "@/components/Feed";
import PromptService from "@/utils/PromptService";
import mockPostsResponse from "@/utils/TestData";

describe("Feed component tests", () => {
    beforeEach(() => {
        jest.spyOn(PromptService, "getPrompts").mockResolvedValue(mockPostsResponse);
        render(<Feed />);
    })

    it("Should render the search box", async () => {
        expect(screen.getByTestId("tid-search-input")).toBeInTheDocument()
    })

    it("Should render all posts when search text is empty", async () => {
        await waitFor(() => {
            expect(screen.getAllByTestId("tid-prompt-card").length).toBe(2)
            expect(screen.getByText("This is a prompt")).toBeInTheDocument()
            expect(screen.getByText("First post")).toBeInTheDocument()
        })
    })

    it("Should render only filtered posts after user searches", async () => {
        const searchInput = screen.getByTestId("tid-search-input");
        await waitFor(() => {
            expect(screen.getAllByTestId("tid-prompt-card").length).toBe(2)
        })

        fireEvent.change(searchInput, {
            target: {
                value: "Fir"
            }
        })

        await waitFor(() => {
            expect(screen.getAllByTestId("tid-prompt-card").length).toBe(1)
            expect(screen.queryByText("This is a prompt")).toBeNull()
            expect(screen.getByText("First post")).toBeInTheDocument()
        })
    })

    it("Should render only filtered posts after user clicks on a tag", async () => {
        await waitFor(() => {
            expect(screen.getAllByTestId("tid-prompt-card").length).toBe(2)
        })

        const tag = screen.getByText("#software");
        fireEvent.click(tag)

        await waitFor(() => {
            expect(screen.getAllByTestId("tid-prompt-card").length).toBe(1)
            expect(screen.getByText("This is a prompt")).toBeInTheDocument()
            expect(screen.queryByText("First post")).toBeNull()
        })
    })
})