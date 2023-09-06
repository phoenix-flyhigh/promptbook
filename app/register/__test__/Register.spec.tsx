import renderWithSession from "@/utils/TestUtil";
import Register from "../page";
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react";
import UserService from "@/utils/UserService";

const routerSpy = jest.fn()

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
        }))
    };
});

const getFormFields = () => {
    const emailBox = screen.getByPlaceholderText("Enter your email")
    const passwordBox = screen.getByPlaceholderText("Enter your password")
    const usernameBox = screen.getByPlaceholderText("Enter your username")
    const registerBtn = screen.getByRole("button", { name: "Register" })

    return {
        emailBox,
        passwordBox,
        usernameBox,
        registerBtn
    }
}

describe("Register page tests for logged in user", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("Should redirect to home page if user is already logged in", () => {
        renderWithSession(<Register />)

        expect(routerSpy).toHaveBeenCalledWith('/')
    })
})

describe("Register page form validation tests", () => {
    beforeEach(() => {
        jest.spyOn(UserService, "registerUser").mockResolvedValue("User registered successfully");
        renderWithSession(<Register />, null)
    })

    it("Should render the form with the input fields and register button", () => {
        const {
            emailBox,
            passwordBox,
            usernameBox,
            registerBtn
        } = getFormFields()

        expect(screen.getByText("Promptbook")).toBeInTheDocument();
        expect(emailBox).toBeInTheDocument()
        expect(passwordBox).toBeInTheDocument()
        expect(usernameBox).toBeInTheDocument()
        expect(registerBtn).toBeInTheDocument()
    })

    it(`Should render the error message for email on clicking
        register btn and clear errors when user 
        starts typing in the field of error and not show error if input
        is correct while registering again`, async() => {
        const emailErrorMsg = "Invalid email address"
        const {
            emailBox,
            passwordBox,
            usernameBox,
            registerBtn
        } = getFormFields()

        fireEvent.change(emailBox, {
            target: { value: "absdfdss" }
        })

        fireEvent.change(usernameBox, {
            target: { value: "abcfhfgdd" }
        })

        fireEvent.change(passwordBox, {
            target: { value: "xyzsdfsdfs" }
        })

        fireEvent.click(registerBtn)

        expect(screen.getByText(emailErrorMsg)).toBeInTheDocument()

        fireEvent.change(emailBox, {
            target: { value: "abc@gmail.com" }
        })

        expect(screen.queryByText(emailErrorMsg)).not.toBeInTheDocument()

        fireEvent.click(registerBtn)

        expect(screen.queryByText(emailErrorMsg)).not.toBeInTheDocument()
        expect(screen.getByText("Registering")).toBeInTheDocument()
        await waitForElementToBeRemoved(() => screen.getByText("Registering"))
    })

    it(`Should render the error message for username on
        clicking register btn and clear errors when user 
        starts typing in the field of error and not show error if input
        is correct while registering again`, async() => {

        const usernameErrorMsg = "Invalid Username. Username length must be 7-20 characters"
        const {
            emailBox,
            passwordBox,
            usernameBox,
            registerBtn
        } = getFormFields()

        fireEvent.change(emailBox, {
            target: { value: "abc@gmail.com" }
        })

        fireEvent.change(usernameBox, {
            target: { value: "abc" }
        })

        fireEvent.change(passwordBox, {
            target: { value: "xyzdfsdfsdfs" }
        })

        fireEvent.click(registerBtn)

        expect(screen.getByText(usernameErrorMsg)).toBeInTheDocument()

        fireEvent.change(usernameBox, {
            target: { value: "abcdefgh" }
        })

        expect(screen.queryByText(usernameErrorMsg)).not.toBeInTheDocument()

        fireEvent.click(registerBtn)

        expect(screen.queryByText(usernameErrorMsg)).not.toBeInTheDocument()
        expect(screen.getByText("Registering")).toBeInTheDocument()
        await waitForElementToBeRemoved(() => screen.getByText("Registering"))
    })

    it(`Should render the error message for password on clicking register btn 
        and clear errors when user starts typing in the field of 
        error and not show error if input
        is correct while registering again`, async() => {

        const passwordErrorMsg = "Invalid Password. Password length must be 7-20 characters"
        const {
            emailBox,
            passwordBox,
            usernameBox,
            registerBtn
        } = getFormFields()

        fireEvent.change(emailBox, {
            target: { value: "abc@gmail.com" }
        })

        fireEvent.change(usernameBox, {
            target: { value: "abcefghi" }
        })

        fireEvent.change(passwordBox, {
            target: { value: "xyz" }
        })

        fireEvent.click(registerBtn)

        expect(screen.getByText(passwordErrorMsg)).toBeInTheDocument()

        fireEvent.change(passwordBox, {
            target: { value: "xyzpqrst" }
        })

        expect(screen.queryByText(passwordErrorMsg)).not.toBeInTheDocument()

        fireEvent.click(registerBtn)

        expect(screen.queryByText(passwordErrorMsg)).not.toBeInTheDocument()
        expect(screen.getByText("Registering")).toBeInTheDocument()
        await waitForElementToBeRemoved(() => screen.getByText("Registering"))
    })
})

describe("Register page api tests", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it(`Should render the error message for username on
    clicking register btn and clear errors when user 
    starts typing in the field of error and not show error if input
    is correct while registering again`, async () => {

        jest.spyOn(UserService, "registerUser").mockResolvedValue("User registered successfully");

        renderWithSession(<Register />, null)
        const {
            emailBox,
            passwordBox,
            usernameBox,
            registerBtn
        } = getFormFields()

        fireEvent.change(emailBox, {
            target: { value: "abc@gmail.com" }
        })

        fireEvent.change(usernameBox, {
            target: { value: "abcdefgh" }
        })

        fireEvent.change(passwordBox, {
            target: { value: "xyzdfsdfsdfs" }
        })

        fireEvent.click(registerBtn)

        expect(screen.getByText("Registering")).toBeInTheDocument()
        await waitForElementToBeRemoved(() => screen.getByText("Registering"))
        expect(routerSpy).toHaveBeenCalledWith('/')
    })

    it("Should render Existing email error for wrong email input", async() => {
        const emailErrorMessage = "Email already exists";
        const loginError = "Failed to login. Please try again!"

        jest.spyOn(UserService, "registerUser").mockRejectedValue({
            response : {data: emailErrorMessage}
        });

        renderWithSession(<Register />, null)
        const {
            emailBox,
            passwordBox,
            usernameBox,
            registerBtn
        } = getFormFields()

        fireEvent.change(emailBox, {
            target: { value: "abc@gmail.com" }
        })

        fireEvent.change(usernameBox, {
            target: { value: "abcdefgh" }
        })

        fireEvent.change(passwordBox, {
            target: { value: "xyzdfsdfsdfs" }
        })

        fireEvent.click(registerBtn)

        expect(screen.getByText("Registering")).toBeInTheDocument()
        await waitForElementToBeRemoved(() => screen.getByText("Registering"))

        expect(screen.getByText(emailErrorMessage)).toBeInTheDocument()
        expect(screen.getByText(loginError)).toBeInTheDocument()
    })

    it("Should render existing email error for wrong email input", async() => {
        const loginError = "Failed to login. Please try again!"

        jest.spyOn(UserService, "registerUser").mockRejectedValue("Internal error");

        renderWithSession(<Register />, null)
        const {
            emailBox,
            passwordBox,
            usernameBox,
            registerBtn
        } = getFormFields()

        fireEvent.change(emailBox, {
            target: { value: "abc@gmail.com" }
        })

        fireEvent.change(usernameBox, {
            target: { value: "abcdefgh" }
        })

        fireEvent.change(passwordBox, {
            target: { value: "xyzdfsdfsdfs" }
        })

        fireEvent.click(registerBtn)

        expect(screen.getByText("Registering")).toBeInTheDocument()
        await waitForElementToBeRemoved(() => screen.getByText("Registering"))
        expect(screen.getByText(loginError)).toBeInTheDocument()
    })
})