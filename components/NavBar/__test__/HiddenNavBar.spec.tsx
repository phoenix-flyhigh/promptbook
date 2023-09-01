import renderWithSession from "@/utils/TestUtil";
import NavBar from "..";
import {screen} from "@testing-library/react";

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
const routerSpy = jest.fn();

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
        })),
        usePathname: jest.fn().mockReturnValueOnce("/login")
    };
});

describe("Hidden nav bar tests", () => {
    it("Nav bar should be hidden for login page", () => {
        renderWithSession(<NavBar />, {
            expires: "",
            user: {
                name: "s",
                image: "/logo.png"
            }
        })

        expect(screen.queryByRole("navigation")).not.toBeInTheDocument()
        expect(screen.queryByText("Promptbook")).not.toBeInTheDocument()
    })
})