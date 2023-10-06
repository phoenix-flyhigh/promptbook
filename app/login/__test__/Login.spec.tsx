import renderWithSession from "@/utils/TestUtil";
import { fireEvent, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"
import Login from "../page"

jest.mock('next-auth/react', () => {
    const actual = jest.requireActual("next-auth/react");
    return {
        ...actual,
        signIn: jest.fn().mockImplementation(() =>
            Promise.resolve({ error: '', status: 200, ok: true, url: '' })
        )
    }
});

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

describe("Login page tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        renderWithSession(<Login />, null)
    })

    it("Should render the input boxes and login button", () => {
        const emailBox = screen.getByPlaceholderText("Enter your email or username")
        const passwordBox = screen.getByPlaceholderText("Enter your password")
        const loginBtn = screen.getByRole("button", { name: "Log in" })

        expect(screen.getByText("Promptbook")).toBeInTheDocument();
        expect(emailBox).toBeInTheDocument()
        expect(passwordBox).toBeInTheDocument()
        expect(loginBtn).toBeInTheDocument()
    })

    it("Should render show button in password inputbox only if some value is entered", () => {
        expect(screen.queryByRole("button", { name: 'Show' })).not.toBeInTheDocument()

        const passwordBox = screen.getByPlaceholderText("Enter your password")
        fireEvent.change(passwordBox, { target: { value: 's' } })

        expect(screen.getByRole("button", { name: 'Show' })).toBeInTheDocument()
    })

    it("Should render hide option on clicking show password and hide the password on clicking it", () => {
        const passwordBox = screen.getByPlaceholderText("Enter your password")
        fireEvent.change(passwordBox, { target: { value: 'sam' } })

        const showButton = screen.getByRole("button", { name: 'Show' })
        expect(showButton).toBeInTheDocument()
        fireEvent.click(showButton)

        const hideButton = screen.getByRole("button", { name: 'Hide' })
        expect(hideButton).toBeInTheDocument()

        fireEvent.click(hideButton)

        expect(showButton).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: 'Hide' })).not.toBeInTheDocument()
    })

    it("Should render google login option", async () => {
        const googleLoginBtn = screen.getByText("Log in with Google")

        expect(googleLoginBtn).toBeInTheDocument();
        fireEvent.click(googleLoginBtn)

        expect(screen.getByText("Logging in with Google")).toBeInTheDocument()
        expect(screen.getByTestId("tid-spinner")).toBeInTheDocument()

        await waitForElementToBeRemoved(() => screen.getByText("Logging in with Google"))
    })

    it("Should disable log in button until both email and password is entered and valid", () => {
        const emailBox = screen.getByPlaceholderText("Enter your email or username")
        const passwordBox = screen.getByPlaceholderText("Enter your password")
        const loginBtn = screen.getByRole("button", { name: "Log in" })

        expect(loginBtn).toBeDisabled()
        expect(loginBtn).toHaveClass("opacity-40")

        fireEvent.change(emailBox, { target: { value: 's' } })
        expect(loginBtn).toBeDisabled()

        fireEvent.change(passwordBox, { target: { value: '2412412454' } })
        expect(loginBtn).toBeEnabled()
    })

    it(`Should show the new user registration option and 
        onClick should redirect to register page`, () => {
        const registerOption = screen.getByText("New user? Register here");

        expect(registerOption).toBeInTheDocument();
       
        fireEvent.click(registerOption)

        expect(routerSpy).toHaveBeenCalledWith("/register")
    })
})

describe("Login page tests for logged in users", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("Should redirect to home page if user is already logged in", () => {
        renderWithSession(<Login />, {
            user: {
                id: "7"
            },
            status: "authenticated"
        })

        expect(routerSpy).toHaveBeenCalledWith("/")
    })

    it(`Should show invalid password error clicking log in button 
    if password length is less than 8. On retry should render logging 
    in text in the button until the sign in  call finishes and
    then display log in text in the button`, async () => {
        renderWithSession(<Login />, null)

        const emailBox = screen.getByPlaceholderText("Enter your email or username")
        const passwordBox = screen.getByPlaceholderText("Enter your password")
        const loginBtn = screen.getByRole("button", { name: "Log in" })

        fireEvent.change(emailBox, { target: { value: 's' } })
        fireEvent.change(passwordBox, { target: { value: 's' } })

        fireEvent.click(loginBtn)

        expect(screen.getByText("Invalid Password. Password length must be 7-20 characters")).toBeInTheDocument();

        fireEvent.change(passwordBox, { target: { value: '2412412454' } })

        fireEvent.click(loginBtn)

        expect(screen.queryByText("Invalid Password. Password length must be 7-20 characters")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Logging in" })).toBeInTheDocument();
        expect(screen.getByTestId("tid-spinner")).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: "Logging in" })).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
            expect(routerSpy).toHaveBeenCalledWith("/")
        })
    })
})