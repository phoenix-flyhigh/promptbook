import { screen } from "@testing-library/react"
import mockPostsResponse from "@/utils/TestData"
import renderWithSession from "@/utils/TestUtil"
import Profile from ".."

describe("Profile component tests", () => {
    beforeEach(() => {
        renderWithSession(<Profile
            name={"My name"}
            desc={"Description"}
            data={[mockPostsResponse[1]]}
            handleEdit={() => { }}
            handleDelete={() => { }}
        />, {
            user: { id: "23" }
        })
    })

    it("Should render the user profile", () => {
        expect(screen.getByText("My name Profile")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByTestId("tid-prompt-card")).toBeInTheDocument();
    })
})