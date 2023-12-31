import { screen, waitFor, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import Feed from "@/components/Feed";
import Card from "@/components/Card";
import PromptService from "@/utils/PromptService";
import mockPostsResponse from "@/utils/TestData";
import renderWithSession from "@/utils/TestUtil";

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: jest.fn()
        })),
        usePathname: jest.fn().mockReturnValue("/")
    };
});



describe("Feed component tests", () => {
    beforeEach(async () => {
        jest.spyOn(PromptService, "getPrompts").mockResolvedValue(mockPostsResponse);
        renderWithSession(<Feed />);
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
    })

    it("Should render the search box", async () => {
        expect(screen.getByTestId("tid-search-input")).toBeInTheDocument()
    })

    it(`Should render all posts in order of latest posted 
        first when search text is empty`, async () => {
        expect(screen.getAllByTestId("tid-prompt-card").length).toBe(2)
        expect(screen.getByText("This is a prompt")).toBeInTheDocument()
        expect(screen.getByText("First post")).toBeInTheDocument()
    })

    it("Should render only filtered posts after user searches", async () => {
        const searchInput = screen.getByTestId("tid-search-input");

        expect(screen.getAllByTestId("tid-prompt-card").length).toBe(2)

        fireEvent.change(searchInput, {
            target: {
                value: "Fir"
            }
        })

        await waitFor(() => {
            expect(screen.getAllByTestId("tid-prompt-card").length).toBe(1)
        })
        expect(screen.queryByText("This is a prompt")).toBeNull()
        expect(screen.getByText("First post")).toBeInTheDocument()
    })

    it("Should render only filtered posts after user clicks on a tag", async () => {
        expect(screen.getAllByTestId("tid-prompt-card").length).toBe(2)

        const tag = screen.getByText("#software");
        fireEvent.click(tag)

        expect(screen.getAllByTestId("tid-prompt-card").length).toBe(1)
        expect(screen.getByText("This is a prompt")).toBeInTheDocument()
        expect(screen.queryByText("First post")).toBeNull()
    })
})

describe("Edit and Delete of posts tests in Feed", () => {
    beforeEach(() => {
        jest.spyOn(PromptService, "getPrompts").mockResolvedValue(mockPostsResponse);
    })
    it(`Should not render edit and delete button when the 
        path is not profile and post creator is user logged in`, () => {
        renderWithSession(<Card post={mockPostsResponse[0]} handleTagClick={() => { }} />, {
            user: {
                id: "1"
            }
        });

        expect(screen.queryByText("Edit")).toBeNull();
        expect(screen.queryByText("Delete")).toBeNull();
    })

    it(`Should not render edit and delete button when the 
        path is not profile and post creator is not user logged in`, () => {
        renderWithSession(<Card post={mockPostsResponse[0]} handleTagClick={() => { }} />, {
            user: {
                id: "3"
            }
        });

        expect(screen.queryByText("Edit")).toBeNull();
        expect(screen.queryByText("Delete")).toBeNull();
    })
})

describe("Unsuccessful api calls in feed tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })
    it("Should return loading text initially until api call finishes", () => {
        jest.spyOn(PromptService, "getPrompts").mockResolvedValue(mockPostsResponse);
        renderWithSession(<Feed />);

        expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("Should render errir message and try again button on api request failure", async () => {
        const serviceSpy = jest.spyOn(PromptService, "getPrompts").mockRejectedValue(new Error("err"));
        renderWithSession(<Feed />);
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
        
        const tryAgainButton = screen.getByRole("button", {
            name: "Try again"
        })
        expect(serviceSpy).toHaveBeenCalledTimes(1)
        expect(screen.getByText("Failed to load posts")).toBeInTheDocument();
        expect(tryAgainButton).toBeInTheDocument();
        
        fireEvent.click(tryAgainButton)
        await waitForElementToBeRemoved(() => screen.getByText("Loading..."))
        expect(serviceSpy).toHaveBeenCalledTimes(2)
    })
})