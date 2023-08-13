import {fireEvent, screen, waitFor} from "@testing-library/react"
import mockPostsResponse from "@/utils/TestData"
import renderWithSession from "@/utils/TestUtil"
import UserService from "@/utils/UserService"
import MyProfile from "../page"

const routerSpy = jest.fn()

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
        })),
        usePathname: jest.fn().mockReturnValue("/profile")
    };
});

describe("My profile page tests", () => {
    beforeEach(() => {
        jest.spyOn(UserService, "getPostsByUser").mockResolvedValue([mockPostsResponse[1]])
        renderWithSession(<MyProfile/>, {
            user : {
                id: "23"
            }
        })
    })

    it("Should render the feed for user profile", () => {
        expect(screen.getByText("My Profile")).toBeInTheDocument();
    })

    it("Should redirect on clicking edit button", async() => {
        await waitFor(() => {
            const editButton = screen.getByText("Edit")
            expect(editButton).toBeInTheDocument();

            fireEvent.click(editButton);
            expect(routerSpy).toHaveBeenCalled()
        })
    })
})