import { screen, fireEvent } from "@testing-library/react";
import NavBar from "@/components/NavBar";
import renderWithSession from "@/utils/TestUtil";

//TODO: tests for sign in button in desktop and mobile

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
        const themeButton: HTMLElement[] = screen.getAllByText("Switch to Dark Theme");

        expect(dropdown).toBeInTheDocument();
        expect(createPromptOption.length).toBe(2);
        expect(signOutOption.length).toBe(2);
        expect(myProfileOption).toBeInTheDocument();
        expect(themeButton.length).toBe(2);
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
        const themeButton: HTMLElement = screen.getByText("Switch to Dark Theme");

        expect(createPromptOption).toBeInTheDocument();
        expect(signOutOption).toBeInTheDocument();
        expect(themeButton).toBeInTheDocument();
    })

    it("Should change theme button title on changing thene", () => {
        renderWithSession(<NavBar />, {
            expires: "",
            user: {
                name: "s",
                image: "/logo.png"
            }
        });
        const themeButton: HTMLElement = screen.getByText("Switch to Dark Theme");

        fireEvent.click(themeButton)

        expect(screen.getByText("Switch to Light Theme")).toBeInTheDocument();
        expect(screen.queryByText("Switch to Dark Theme")).not.toBeInTheDocument();
    })
})
