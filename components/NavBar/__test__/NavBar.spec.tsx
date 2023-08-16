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
        jest.spyOn(window.screen, "width", "get").mockReturnValue(200);

        renderWithSession(<NavBar />, {
            expires: "",
            user: {
                name: "s",
                image: "/logo.png"
            }
        })
        const profileIcon: HTMLImageElement = screen.getByTestId("tid-profile-icon-mobile");

        expect(profileIcon).toBeInTheDocument();

        fireEvent.click(profileIcon);

        const dropdown: HTMLElement = screen.getByTestId("tid-nav-dropdown");
        const createPromptOption: HTMLElement[] = screen.getAllByText("Create Post");
        const signOutOption: HTMLElement[] = screen.getAllByText("Sign Out");
        const myProfileOption: HTMLElement = screen.getByText("My Profile");
        const themeButton: HTMLElement = screen.getByText("Switch to Dark Theme");

        expect(dropdown).toBeInTheDocument();
        expect(createPromptOption.length).toBe(2);
        expect(signOutOption.length).toBe(2);
        expect(myProfileOption).toBeInTheDocument();
        expect(themeButton).toBeInTheDocument();
    })

    it("Should render the the menu items in the nav bar for desktop", () => {
        renderWithSession(<NavBar />, {
            expires: "",
            user: {
                name: "s",
                image: "/logo.png"
            }
        });
        const profileIcon: HTMLImageElement = screen.getByTestId("tid-profile-icon-desktop");

        expect(profileIcon).toBeInTheDocument();

        const createPromptOption: HTMLElement = screen.getByText("Create Post");
        const signOutOption: HTMLElement = screen.getByText("Sign Out");

        expect(createPromptOption).toBeInTheDocument();
        expect(signOutOption).toBeInTheDocument();
    })

    it("Should change theme button title on changing theme from light to dark", async () => {
        jest.spyOn(window.screen, "width", "get").mockReturnValue(200);

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
        const profileIcon: HTMLImageElement = screen.getByTestId("tid-profile-icon-mobile");
        fireEvent.click(profileIcon);
        const themeButton: HTMLElement = screen.getByText("Switch to Dark Theme");
        fireEvent.click(themeButton)
        fireEvent.click(profileIcon);

        expect(screen.getByText("Switch to Light Theme")).toBeInTheDocument();
        expect(screen.queryByText("Switch to Dark Theme")).not.toBeInTheDocument();
    })

    it("Should change theme button title on changing theme from dark to light", async () => {
        jest.spyOn(window.screen, "width", "get").mockReturnValue(200);

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
        const profileIcon: HTMLImageElement = screen.getByTestId("tid-profile-icon-mobile");
        fireEvent.click(profileIcon);
        const themeButton: HTMLElement = screen.getByText("Switch to Light Theme");
        fireEvent.click(themeButton)
        fireEvent.click(profileIcon);

        expect(screen.getByText("Switch to Dark Theme")).toBeInTheDocument();
        expect(screen.queryByText("Switch to Light Theme")).not.toBeInTheDocument();
    })
})
