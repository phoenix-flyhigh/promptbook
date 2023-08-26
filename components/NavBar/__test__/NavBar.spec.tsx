import { screen, fireEvent, waitFor } from "@testing-library/react";
import NavBar from "@/components/NavBar";
import renderWithSession from "@/utils/TestUtil";
import { ThemeProvider } from "next-themes";

//TODO: tests for sign in button in desktop and mobile
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

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: jest.fn()
        })),
        usePathname: jest.fn().mockReturnValue("/")
    };
});


const openProfileMenu = () => {
    const profileIcon: HTMLImageElement = screen.getByTestId("tid-profile-icon-mobile");
    fireEvent.click(profileIcon);
}

describe("NavBar component tests", () => {
    it("Should render the app logo", () => {
        renderWithSession(<NavBar />, {
            expires: "",
            user: {
                name: "s",
                image: "/logo.png"
            }
        })

        expect(screen.getByTestId("tid-app-logo")).toBeInTheDocument()
    })
})

describe("NavBar component tests for signedIn users", () => {
    it("Should render the the menu items in a dropdown for mobile", () => {
        renderWithSession(<NavBar />, {
            expires: "",
            user: {
                name: "s",
                image: "/logo.png"
            }
        })
        openProfileMenu()

        const dropdown: HTMLElement = screen.getByTestId("tid-nav-dropdown");
        const createPromptOption: HTMLElement = screen.getByText("Create Post");
        const signOutOption: HTMLElement = screen.getByText("Sign Out");
        const myProfileOption: HTMLElement = screen.getByText("My Profile");
        const themeButton: HTMLElement = screen.getByText("Switch to Dark Theme");

        expect(dropdown).toBeInTheDocument();
        expect(createPromptOption).toBeInTheDocument();
        expect(signOutOption).toBeInTheDocument();
        expect(myProfileOption).toBeInTheDocument();
        expect(themeButton).toBeInTheDocument();
    })

    it("Should change theme button title on changing theme from light to dark", async () => {
        renderWithSession(
            <ThemeProvider attribute="class">
                <NavBar />
            </ThemeProvider>
            , {
                expires: "",
                user: {
                    name: "s",
                    image: "/logo.png"
                }
            });
        openProfileMenu()
        const themeButton: HTMLElement = screen.getByText("Switch to Dark Theme");
        fireEvent.click(themeButton)
        openProfileMenu()
        
        expect(screen.getByText("Switch to Light Theme")).toBeInTheDocument();
        expect(screen.queryByText("Switch to Dark Theme")).not.toBeInTheDocument();
    })

    it("Should change theme button title on changing theme from dark to light", async () => {
        renderWithSession(
            <ThemeProvider attribute="class" forcedTheme="dark">
                <NavBar />
            </ThemeProvider>
            , {
                expires: "",
                user: {
                    name: "s",
                    image: "/logo.png"
                }
            });
        openProfileMenu()
        const themeButton: HTMLElement = screen.getByText("Switch to Light Theme");
        fireEvent.click(themeButton)
        openProfileMenu()

        expect(screen.getByText("Switch to Dark Theme")).toBeInTheDocument();
        expect(screen.queryByText("Switch to Light Theme")).not.toBeInTheDocument();
    })
})


describe("NavBar component tests for not logged in users", () => {
    it("Should render the sign in button", () => {
        renderWithSession(<NavBar />,null)

        expect(screen.getByRole("button", {name: "Sign In"})).toBeInTheDocument()
    })
})
