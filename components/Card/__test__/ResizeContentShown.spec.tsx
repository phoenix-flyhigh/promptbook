import mockPostsResponse from "@/utils/TestData"
import renderWithSession from "@/utils/TestUtil"
import Card from ".."
import { fireEvent, screen } from "@testing-library/react";

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: jest.fn()
        })),
        usePathname: jest.fn().mockReturnValue("/profile")
    };
});

describe("Show more and show less functionality tests", () => {
    const originalPrompt = `Explain the concept of asynchronous programming in JavaScript and provide examples with code snippet. Also explain the different types of implementing async functions in javascript and the pros and cons of each one of them with examples`;

    it("Should not render show more button if text is less than specified length", () => {
        renderWithSession(
            <Card
                post={mockPostsResponse[0]}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText("This is a prompt")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
    })

    it("Should render show more button if text is more than specified length", () => {
        const expectedText = `Explain the concept of asynchronous programming in JavaScript and provide examples with code snippet. Also explain the different types of`
        
        renderWithSession(
            <Card
                post={{
                    ...mockPostsResponse[0],
                    prompt: originalPrompt
                }}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText(expectedText)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Show more" })).toBeInTheDocument();
    })

    it(`Should render show more button even if wordCount is less than specified number
        but total prompt length is greater than 250 characters`, () => {
        const expectedText = `Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser`
        
        renderWithSession(
            <Card
                post={{
                    ...mockPostsResponse[0],
                    prompt: "Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser Thisisarandomtextthathasbeenaddedbyuser"
                }}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText(expectedText)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Show more" })).toBeInTheDocument();
    })

    it(`Should render entire text and show less button when user 
        clicks on show more button`, () => {
        renderWithSession(
            <Card
                post={{
                    ...mockPostsResponse[0],
                    prompt: originalPrompt
                }}
                handleTagClick={() => { }}
            />)

        const showMoreButton = screen.getByRole("button", { name: "Show more" })
        fireEvent.click(showMoreButton)

        expect(screen.getByText(originalPrompt)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
    })

    it(`Should collapse the text and render the show more 
        button when user clicks on show less button`, () => {
        const expectedText = `Explain the concept of asynchronous programming in JavaScript and provide examples with code snippet. Also explain the different types of`

        renderWithSession(
            <Card
                post={{
                    ...mockPostsResponse[0],
                    prompt: originalPrompt
                }}
                handleTagClick={() => { }}
            />)

        const showMoreButton = screen.getByRole("button", { name: "Show more" })
        fireEvent.click(showMoreButton)

        expect(screen.getByText(originalPrompt)).toBeInTheDocument();

        const showLessButton = screen.getByRole("button", { name: "Show less" })
        fireEvent.click(showLessButton)

        expect(screen.getByText(expectedText)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Show more" })).toBeInTheDocument();
    })
})