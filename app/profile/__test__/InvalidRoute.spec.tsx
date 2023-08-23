import renderWithSession from "@/utils/TestUtil";
import { screen } from "@testing-library/dom";
import Profile from "../page"

const routerSpy = jest.fn()

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
        })),
        useSearchParams: jest.fn().mockImplementation(() => ({
            get: (id: string) => null
        }))
    };
});

describe("Invalid route tests for profile page", () => {
    it("Should not render form show with appropriate error message", () => {
        renderWithSession(<Profile />, {
            user: {
                id: "23"
            }
        })

        expect(screen.getByText("Invalid Url. Please enter a valid user id")).toBeInTheDocument()
        expect(screen.queryByText("My Profile")).not.toBeInTheDocument()
    })
})