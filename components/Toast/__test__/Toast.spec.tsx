import { render , screen} from "@testing-library/react"
import Toast from ".."

describe("Toast component tests", () => {
    it("Should render the message", () => {
        const toastMessage = "Failed to create post. Please try again later"
        render(<Toast message={toastMessage} showToast={true} onClose={() => {}}/>)

        expect(screen.getByText(toastMessage)).toBeInTheDocument()
    })
})