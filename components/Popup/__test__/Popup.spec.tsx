import { fireEvent, render, screen } from "@testing-library/react"
import Popup from ".."

describe("Pop up tests", () => {
    const title = "Please login to view more"
    const description = "Login to see more"
    const buttonText = "Login"
    const handler = jest.fn();

    beforeEach(() => {
        render(<Popup
            title={title}
            description={description}
            buttonHandler={handler}
            buttonText={buttonText}
            onClose={() => {}}
        />)
    })

    it("Should render the elements of the pop up", () => {
        expect(screen.getByText(title)).toBeInTheDocument()
        expect(screen.getByText(description)).toBeInTheDocument()
        expect(screen.getByText(buttonText)).toBeInTheDocument()
    })

    it("Should call handler on click of button", () => {
        const button = screen.getByText(buttonText)
        fireEvent.click(button)

        expect(handler).toHaveBeenCalled();
    })
})