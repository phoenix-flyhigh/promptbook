import renderWithSession from "@/utils/TestUtil";
import Login from "../page";
import { screen, fireEvent, waitFor } from "@testing-library/react";

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

jest.mock('next-auth/react', () => {
    const actual = jest.requireActual("next-auth/react");
    return {
        ...actual,
        signIn: jest.fn().mockImplementation(() =>
            Promise.resolve({ error: 'No user found', status: 403, ok: false, url: '' })
        )
    }
});

describe("Failed login for invalid user test", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it(`Should show invalid email text if no user found and
        render logging in text in the button until the sign in 
        call finishes and then display log in text in the button`, async () => {
        renderWithSession(<Login />, null)

        const emailBox = screen.getByPlaceholderText("Enter your email or username")
        const passwordBox = screen.getByPlaceholderText("Enter your password")
        const loginBtn = screen.getByRole("button", { name: "Log in" })

        fireEvent.change(emailBox, { target: { value: 's' } })
        fireEvent.change(passwordBox, { target: { value: '453453453' } })

        fireEvent.click(loginBtn)
        expect(screen.getByRole("button", { name: "Logging in" })).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Invalid email or username")).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Logging in" })).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
        })
    })
})