import renderWithSession from "@/utils/TestUtil";
import { screen } from "@testing-library/dom";
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
            get: (id: string) => null
        }))
    };
});

describe("Invalid route tests for update post page", () => {
    it("Should not render form show with appropriate error message", () => {
        renderWithSession(<EditPrompt/>)

        expect(screen.getByText("Invalid Url. Please enter a valid prompt id")).toBeInTheDocument()
        expect(screen.queryByText("Your AI Prompt")).not.toBeInTheDocument()
    })
})