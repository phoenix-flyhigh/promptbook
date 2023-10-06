import { screen, fireEvent } from "@testing-library/react";
import NavBar from "@/components/NavBar";
import renderWithSession from "@/utils/TestUtil";

const routerSpy = jest.fn();

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
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

    it("Should render the profile logo of user", () => {
        renderWithSession(<NavBar />, {
            expires: "",
            user: {
                name: "s",
                image: "/logo.png"
            }
        })
        const img = screen.getByAltText("Profile photo")

        expect(img.getAttribute('src')).toContain('logo.png')
    })
    
    it("Should render the dummy profile icon if user image doesnt exist", () => {
        renderWithSession(<NavBar />, {
            expires: "",
            user: {
                name: "s",
                image: ""
            }
        })
        const img = screen.getByAltText("Profile photo")

        expect(img.getAttribute('src')).toContain('/icons/profile-icon.svg')
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

        expect(dropdown).toBeInTheDocument();
        expect(createPromptOption).toBeInTheDocument();
        expect(signOutOption).toBeInTheDocument();
        expect(myProfileOption).toBeInTheDocument();
    })
})


describe("NavBar component tests for not logged in users", () => {
    beforeEach(() => jest.clearAllMocks())
    
    it("Should render the sign in button", () => {
        renderWithSession(<NavBar />, null)
        const signInBtn = screen.getByRole("button", { name: "Sign In" });

        expect(signInBtn).toBeInTheDocument()
        fireEvent.click(signInBtn)

        expect(routerSpy).toHaveBeenCalledWith("/login")
    })
})
