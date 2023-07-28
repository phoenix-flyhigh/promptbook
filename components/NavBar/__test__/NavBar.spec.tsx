import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "@/components/NavBar";
import AuthUtil from "@/utils/AuthUtil";
import Provider from "@/utils/Provider";
import * as AuthProviders from "next-auth/react";

const renderNavBar = () => render(
    <Provider>
        <NavBar />
    </Provider>
);

//WIP
describe.skip("NavBar component tests", () => {
    it("Should render the app logo", () => {
        jest.spyOn(AuthProviders, "getProviders").mockResolvedValue(null)
        renderNavBar();

        expect(screen.getByTestId("tid-app-logo")).toBeInTheDocument()
    })
})

describe.skip("NavBar component tests for signedIn users", () => {

    beforeEach(() => {
        jest.spyOn(AuthUtil, "getUserFromSession").mockReturnValue({
            name: "123",
            email: "123@gmail.com",
            image: ""
        })
    })

    it("Should render the the menu items in a dropdown for mobile", () => {
        jest.spyOn(window.screen, "width", "get").mockReturnValue(200);

        renderNavBar();
        const profileIcon: HTMLImageElement = screen.getByTestId("tid-profile-icon-mobile");

        expect(profileIcon).toBeInTheDocument();

        fireEvent.click(profileIcon);

        const dropdown: HTMLElement = screen.getByTestId("tid-nav-dropdown");
        const createPromptOption: HTMLElement[] = screen.getAllByText("Create Prompt");
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

        const createPromptOption: HTMLElement = screen.getByText("Create Prompt");
        const signOutOption: HTMLElement = screen.getByText("Sign Out");

        expect(createPromptOption).toBeInTheDocument();
        expect(signOutOption).toBeInTheDocument();
    })
})