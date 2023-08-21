import { fireEvent, screen } from "@testing-library/react"
import mockPostsResponse from "@/utils/TestData"
import renderWithSession from "@/utils/TestUtil"
import Profile from ".."

const routerSpy = jest.fn()
jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
        })),
        useSearchParams: jest.fn().mockImplementation(() => ({
            get: (id: string) => "23"
        }))
    };
});

describe("Profile component tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("Should render the user profile", () => {
        renderWithSession(<Profile
            name={"My name"}
            desc={"Description"}
            data={[mockPostsResponse[1]]}
            handleEdit={() => { }}
            handleDelete={() => { }}
        />, {
            user: { id: "23" }
        })

        expect(screen.getByText("My name Profile")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByTestId("tid-prompt-card")).toBeInTheDocument();
    })

    it(`Should render the user profile with no posts tag 
        when there are no posts`, () => {
        renderWithSession(<Profile
            name={"My name"}
            desc={"Description"}
            data={[]}
            handleEdit={() => { }}
            handleDelete={() => { }}
        />, {
            user: { id: "23" }
        })

        expect(screen.getByText("My name Profile")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.queryByTestId("tid-prompt-card")).not.toBeInTheDocument();

        expect(screen.getByText("No posts yet")).toBeInTheDocument()
        expect(screen.getByText("Start sharing by creating a post")).toBeInTheDocument()
        
        const createButton = screen.getByRole("button", {name: "Create Post"})

        expect(createButton).toBeInTheDocument()
        
        fireEvent.click(createButton)

        expect(routerSpy).toHaveBeenCalledTimes(1)
        expect(routerSpy).toHaveBeenCalledWith('/create-post')
    })
})