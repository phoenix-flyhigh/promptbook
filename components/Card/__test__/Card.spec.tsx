import mockPostsResponse from "@/utils/TestData"
import renderWithSession from "@/utils/TestUtil"
import { fireEvent, screen } from "@testing-library/react"
import Card from ".."
import { ThemeProvider } from "next-themes"

const routerSpy = jest.fn()

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: routerSpy
        })),
        usePathname: jest.fn().mockReturnValue("/profile")
    };
});

describe("Card component tests", () => {
    beforeEach(() => {
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn(),
            },
        });
        Date.now = jest.fn(() => new Date("Thu Sept 7 2023 12:00:20").getTime())

        renderWithSession(<Card post={mockPostsResponse[0]} handleTagClick={() => { }} />)
    })

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    })

    it("Should render the card component", () => {
        const userImage = screen.getByAltText("user_image")
        const username = screen.getByText("s")
        const prompt = screen.getByText("This is a prompt")
        const tag = screen.getByText("#software")
        const timeStamp = screen.getByText("1 second ago")
        const copyIcon = screen.getByAltText("copy_icon")

        expect(userImage).toBeInTheDocument()
        expect(username).toBeInTheDocument()
        expect(prompt).toBeInTheDocument()
        expect(tag).toBeInTheDocument()
        expect(timeStamp).toBeInTheDocument()
        expect(copyIcon).toBeInTheDocument()
    })

    it("Should render tick icon when user has copied a prompt", () => {
        const copyIcon = screen.getByAltText("copy_icon")

        fireEvent.click(copyIcon);

        expect(screen.getByAltText("tick_icon")).toBeInTheDocument()
        expect(screen.queryByAltText("copy_icon")).toBeNull()
    })

    it(`Should redirect to the author profile on 
        clicking on the author id in the card`, () => {
        const authorSection = screen.getByTestId("tid-author-section")

        fireEvent.click(authorSection)

        expect(routerSpy).toHaveBeenCalledTimes(1)
        expect(routerSpy).toHaveBeenCalledWith('/profile?id=1')
    })
})

describe("Card without session tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it(`Should show login popup if user is not signed in 
        and clicks on user profile`, () => {
            renderWithSession(<Card post={mockPostsResponse[0]} handleTagClick={() => { }} />, null)
       
            const authorSection = screen.getByTestId("tid-author-section")
            fireEvent.click(authorSection)
    
            expect(routerSpy).toHaveBeenCalledTimes(0)
            expect(screen.getByText("Please login to view more")).toBeInTheDocument();
    })
})

describe("Profile image tests", () => {

    it("Should render profile image of creator if it exists", () => {
        renderWithSession(<Card post={mockPostsResponse[0]} handleTagClick={() => { }} />)
        const img = screen.getByAltText("user_image")

        expect(img.getAttribute('src')).toContain('logo.png')
    })

    it("Should render dummy profile icon if creator image doesn't exist", () => {
        renderWithSession(
            <Card
                post={{
                    ...mockPostsResponse[0],
                    creator: {
                        ...mockPostsResponse[0].creator,
                        image: ""
                    }
                }}
                handleTagClick={() => { }}
            />)
        const img = screen.getByAltText("user_image")

        expect(img.getAttribute('src')).toBe('/icons/profile-icon.svg')
    })
})

describe("Theme based icon tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn(),
            },
        });
    })

    it("Should render light theme copy icon and tick when theme is light", () => {
        renderWithSession(
            <ThemeProvider attribute="class" defaultTheme="light">
                <Card post={mockPostsResponse[0]} handleTagClick={() => { }} />
            </ThemeProvider>
        )
        const copyIcon = screen.getByAltText("copy_icon")

        expect(copyIcon.getAttribute('src')).toEqual("/icons/copy-icon.svg")

        fireEvent.click(copyIcon);
        const tickIcon = screen.getByAltText("tick_icon")

        expect(tickIcon.getAttribute('src')).toEqual("/icons/tick-icon.svg")
    })

    it("Should render dark theme copy icon and tick when theme is dark", () => {
        renderWithSession(
            <ThemeProvider attribute="class" defaultTheme="dark">
                <Card post={mockPostsResponse[0]} handleTagClick={() => { }} />
            </ThemeProvider>
        )
        const copyIcon = screen.getByAltText("copy_icon")

        expect(copyIcon.getAttribute('src')).toEqual("/icons/copy-icon-dark.svg")

        fireEvent.click(copyIcon);
        const tickIcon = screen.getByAltText("tick_icon")

        expect(tickIcon.getAttribute('src')).toEqual("/icons/tick-icon-dark.svg")
    })
})

describe("Edit and Delete button in Card tests", () => {
    it(`Should render edit and delete button when the 
        path is profile and post creator is user logged in`, () => {
        renderWithSession(<Card
            post={mockPostsResponse[0]}
            handleEdit={() => { }}
            handleDelete={() => { }}
        />, {
            user: {
                id: "1"
            }
        })
        const editButton = screen.getByText("Edit")
        const deleteButton = screen.getByText("Delete")

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    })

    it(`Should call respective handlers when edit and
         delete buttons are clicked`, () => {
        let isEditCalled = false;
        let isDeleteCalled = false;

        renderWithSession(<Card
            post={mockPostsResponse[0]}
            handleEdit={() => { isEditCalled = true }}
            handleDelete={() => { isDeleteCalled = true }}
        />, {
            user: {
                id: "1"
            }
        })
        const editButton = screen.getByText("Edit")
        const deleteButton = screen.getByText("Delete")

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(editButton);
        expect(isEditCalled).toBeTruthy();

        fireEvent.click(deleteButton)
        expect(isDeleteCalled).toBeTruthy();
    })

    it(`Should not perform any action when edit and delete buttons are clicked
        but there are no handlers`, () => {
        let isEditCalled = false;
        let isDeleteCalled = false;

        renderWithSession(<Card
            post={mockPostsResponse[0]}
        />, {
            user: {
                id: "1"
            }
        })
        const editButton = screen.getByText("Edit")
        const deleteButton = screen.getByText("Delete")

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(editButton);
        expect(isEditCalled).toBeFalsy();

        fireEvent.click(deleteButton)
        expect(isDeleteCalled).toBeFalsy();
    })

    it(`Should not render edit and delete button when the 
        path is profile but post creator is not user logged in`, () => {
        renderWithSession(<Card
            post={mockPostsResponse[0]}
            handleEdit={() => { }}
            handleDelete={() => { }}
        />, {
            user: {
                id: "2"
            }
        })

        expect(screen.queryByText("Edit")).toBeNull();
        expect(screen.queryByText("Delete")).toBeNull();
    })
})