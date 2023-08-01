import { setupServer } from "msw/node";
import { rest } from "msw";
import UserService from "../UserService";

describe("User service get all posts success test", () => {
    const handlers = [
        rest.get("/api/users/7/posts", async (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({ prompt: "s", tag: "s", _id:"7", creator: {} }));
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

        expect(response).toEqual({
            prompt: "s",
            tag: "s",
            _id: "7",
            creator: {}
        })
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