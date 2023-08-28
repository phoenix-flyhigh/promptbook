import renderWithSession from "@/utils/TestUtil"
import Card from ".."
import { screen } from "@testing-library/react";

jest.mock("next/navigation", () => {
    const actual = jest.requireActual("next/navigation");
    return {
        ...actual,
        useRouter: jest.fn().mockImplementation(() => ({
            push: jest.fn()
        })),
        usePathname: jest.fn().mockReturnValue("/profile")
    };
});

const getPostWithGivenTimestamp = (timestamp: string) => ({
    prompt: "This is a prompt",
    tag: "#software",
    _id: "7",
    timeStamp: new Date(timestamp),
    creator: {
        username: "s",
        _id: "1",
        email: "123@gmail.com",
        image: "/logo.png"
    }
})

describe("Posted ago time in card tests", () => {

    beforeAll(() => {
        Date.now = jest.fn(() => new Date("Thu Sept 7 2023 12:00:20").getTime())
    })

    afterAll(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
    })

    it("Should render card with time stamp in second ago", () => {
        renderWithSession(
            <Card
                post={getPostWithGivenTimestamp("Thu Sept 7 2023 12:00:19")}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText("1 second ago")).toBeInTheDocument()
    })

    it("Should render card with time stamp in seconds ago", () => {
        renderWithSession(
            <Card
                post={getPostWithGivenTimestamp("Thu Sept 7 2023 12:00:00")}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText("20 seconds ago")).toBeInTheDocument()
    })

    it("Should render card with time stamp in minute ago", () => {
        renderWithSession(
            <Card
                post={getPostWithGivenTimestamp("Thu Sept 7 2023 11:58:21")}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText("1 minute ago")).toBeInTheDocument()
    })

    it("Should render card with time stamp in minutes ago", () => {
        renderWithSession(
            <Card
                post={getPostWithGivenTimestamp("Thu Sept 7 2023 11:53:00")}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText("7 minutes ago")).toBeInTheDocument()
    })

    it("Should render card with time stamp in hour ago", () => {
        renderWithSession(
            <Card
                post={getPostWithGivenTimestamp("Thu Sept 7 2023 11:00:00")}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText("1 hour ago")).toBeInTheDocument()
    })

    it("Should render card with time stamp in hours ago", () => {
        renderWithSession(
            <Card
                post={getPostWithGivenTimestamp("Thu Sept 7 2023 05:00:00")}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText("7 hours ago")).toBeInTheDocument()
    })

    it(`Should render card with time stamp with day and month, 
        not year if posted year is same as current year`, () => {
        renderWithSession(
            <Card
                post={getPostWithGivenTimestamp("Thu Jul 16 2023 05:00:00")}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText("July 16")).toBeInTheDocument()
    })

    it(`Should render card with time stamp with day, month
        and year if posted year is not same as current year`, () => {
        renderWithSession(
            <Card
                post={getPostWithGivenTimestamp("Thu Sept 7 2022 05:00:00")}
                handleTagClick={() => { }}
            />)

        expect(screen.getByText("September 7, 2022")).toBeInTheDocument()
    })
})