import {screen} from "@testing-library/react"
import mockPostsResponse from "@/utils/TestData"
import renderWithSession from "@/utils/TestUtil"
import UserService from "@/utils/UserService"
import MyProfile from "../page"

describe("My profile page tests", () => {
    beforeEach(() => {
        jest.spyOn(UserService, "getPostsByUser").mockResolvedValue([mockPostsResponse[1]])
    })
    it("Should render the feed for user profile", () => {
        renderWithSession(<MyProfile/>, {
            user : {
                id: "23"
            }
        })

        expect(screen.getByText("My Profile")).toBeInTheDocument();
    })
})