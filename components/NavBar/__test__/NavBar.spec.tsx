import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "@/components/NavBar";
import { SessionProvider } from 'next-auth/react'

const renderNavBar = () => render(
    <SessionProvider session={{
        expires: "",
        user: {
            name: "s",
            image: "/logo.png"
        }
    }}>
        <NavBar />
    </SessionProvider>
);

//TODO: tests for sign in button in desktop and mobile

describe("NavBar component tests", () => {
    it("Should render the app logo", () => {
        renderNavBar()

        expect(screen.getByTestId("tid-app-logo")).toBeInTheDocument()
    })
})

describe("NavBar component tests for signedIn users", () => {
    it("Should render the the menu items in a dropdown for mobile", () => {
        jest.spyOn(window.screen, "width", "get").mockReturnValue(200);

        renderNavBar();
        const profileIcon: HTMLImageElement = screen.getByTestId("tid-profile-icon-mobile");

        expect(profileIcon).toBeInTheDocument();

        fireEvent.click(profileIcon);

        const dropdown: HTMLElement = screen.getByTestId("tid-nav-dropdown");
        const createPromptOption: HTMLElement[] = screen.getAllByText("Create Post");
        const signOutOption: HTMLElement[] = screen.getAllByText("Sign Out");
        const myProfileOption: HTMLElement = screen.getByText("My Profile");

        expect(dropdown).toBeInTheDocument();
        expect(createPromptOption.length).toBe(2);
        expect(signOutOption.length).toBe(2);
        expect(myProfileOption).toBeInTheDocument();
    })

    it("Should render the the menu items in the nav bar for desktop", () => {
        renderNavBar();
        const profileIcon: HTMLImageElement = screen.getByTestId("tid-profile-icon-desktop");

        expect(profileIcon).toBeInTheDocument();

        const createPromptOption: HTMLElement = screen.getByText("Create Post");
        const signOutOption: HTMLElement = screen.getByText("Sign Out");

        expect(createPromptOption).toBeInTheDocument();
        expect(signOutOption).toBeInTheDocument();
    })
})
