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
            Promise.resolve({ error: 'Incorrect password', status: 403, ok: false, url: '' })
        )
    }
});

describe("Failed login for invalid password test", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("Should show incorrect password message if password is incorrect", async () => {
        renderWithSession(<Login />, null)

        const emailBox = screen.getByPlaceholderText("Enter your email or username")
        const passwordBox = screen.getByPlaceholderText("Enter your password")
        const loginBtn = screen.getByRole("button", { name: "Log in" })

        fireEvent.change(emailBox, { target: { value: 's' } })
        fireEvent.change(passwordBox, { target: { value: '453453453' } })

        fireEvent.click(loginBtn)
        await waitFor(() => {
            expect(screen.getByText("Incorrect password")).toBeInTheDocument();
        })
    })
})