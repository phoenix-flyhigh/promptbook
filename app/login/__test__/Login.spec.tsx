import renderWithSession from "@/utils/TestUtil";
import { fireEvent, screen, waitFor } from "@testing-library/react"
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
        
        expect(screen.getByText("Login to Promptbook")).toBeInTheDocument();
        expect(emailBox).toBeInTheDocument()
        expect(passwordBox).toBeInTheDocument()
        expect(loginBtn).toBeInTheDocument()
    })
    
    it("Should render google login option",() => {
        const googleLoginBtn = screen.getByText("Log in with Google")

        expect(googleLoginBtn).toBeInTheDocument();
    })

    it("Should disable log in button until both email and password is entered and valid", () => {
        const emailBox = screen.getByPlaceholderText("Enter your email or username")
        const passwordBox = screen.getByPlaceholderText("Enter your password")
        const loginBtn = screen.getByRole("button", { name: "Log in" })

        expect(loginBtn).toBeDisabled()

        fireEvent.change(emailBox, { target: { value: 's' } })
        expect(loginBtn).toBeDisabled()

        fireEvent.change(passwordBox, { target: { value: '2412412454' } })
        expect(loginBtn).toBeEnabled()
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
    if password length is less than 8`, async () => {
        renderWithSession(<Login />, null)

        const emailBox = screen.getByPlaceholderText("Enter your email or username")
        const passwordBox = screen.getByPlaceholderText("Enter your password")
        const loginBtn = screen.getByRole("button", { name: "Log in" })

        fireEvent.change(emailBox, { target: { value: 's' } })
        fireEvent.change(passwordBox, { target: { value: 's' } })

        fireEvent.click(loginBtn)

        expect(screen.getByText("Invalid Password")).toBeInTheDocument();

        fireEvent.change(passwordBox, { target: { value: '2412412454' } })

        fireEvent.click(loginBtn)

        expect(screen.queryByText("Invalid Password")).not.toBeInTheDocument();

        await waitFor(() => {
            expect(routerSpy).toHaveBeenCalledWith("/")
        })
    })
})