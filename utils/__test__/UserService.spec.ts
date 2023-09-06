import { setupServer } from "msw/node";
import { rest } from "msw";
import UserService from "../UserService";

describe("User service get all posts success test", () => {
    const successResponse: any = {
        creator: {},
        posts: [{
            prompt: "s",
            tag: "s",
            _id: "7",
            creator: {},
        }]
    }

    const handlers = [
        rest.get("/api/users/7/posts", async (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(successResponse));
        }),
    ];
    
    const server = setupServer(...handlers);
    beforeAll(() => server.listen());
    afterEach(() => {
        server.restoreHandlers();
    });

    afterAll(() => server.close());

    it("Should return success response when api request succeeds", async () => {
        const response = await UserService.getPostsByUser("7");

        expect(response).toEqual(successResponse)
    })
})

describe("User service get all posts failure test", () => {
    const handlers = [
        rest.get("/api/users/7/posts", async (req, res, ctx) => {
                return res(ctx.status(401), ctx.json({ message: "Unauthorised"}));
        }),
    ];
    
    const server = setupServer(...handlers);
    beforeAll(() => server.listen());
    afterEach(() => {
        server.restoreHandlers();
    });

    afterAll(() => server.close());

    it("Should throw error when api request fails", async () => {
        let requestFailed = false;
        
        try {
            await UserService.getPostsByUser("7") 
        } catch (error) {
            requestFailed = true
        }

        expect(requestFailed).toBeTruthy()
    })
})

describe("User service register user success tests", () => {
    const successResponse = "User created successfully"

    const handlers = [
        rest.post("/api/users/register", async (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(successResponse));
        })
    ];
    
    const server = setupServer(...handlers);
    beforeAll(() => server.listen());
    afterEach(() => {
        server.restoreHandlers();
    });

    afterAll(() => server.close());

    it("Should return success response when api request succeeds", async () => {
        const userDetails = {
            email: "abc@gmail.com",
            username: "123456778",
            password: "abcdefghjijk"
        }

        const response = await UserService.registerUser(userDetails);

        expect(response).toEqual(successResponse)
    })
})

describe("User service register user error tests", () => {
    const handlers = [
        rest.get("/api/users/register", async (req, res, ctx) => {
                return res(ctx.status(400), ctx.json({ message: "Email already exists"}));
        }),
    ];
    
    const server = setupServer(...handlers);
    beforeAll(() => server.listen());
    afterEach(() => {
        server.restoreHandlers();
    });

    afterAll(() => server.close());

    it("Should throw error when api request fails", async () => {
        let requestFailed = false;
        const userDetails = {
            email: "abc@gmail.com",
            username: "123456778",
            password: "abcdefghjijk"
        }

        try {
            await UserService.registerUser(userDetails) 
        } catch (error) {
            requestFailed = true
        }

        expect(requestFailed).toBeTruthy()
    })
})