import mockPostsResponse from "@/utils/TestData"
import renderWithSession from "@/utils/TestUtil"
import { fireEvent, screen } from "@testing-library/react"
import Card from ".."

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