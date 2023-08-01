import PromptService from "../PromptService"
import { setupServer } from "msw/node";
import { rest } from "msw";
import { CreatePromptRequest } from "@/app/create-prompt/page";

describe("Prompt service post prompt tests", () => {
    const handlers = [
        rest.post("/api/prompt/new", async (req, res, ctx) => {
            const {userId} : CreatePromptRequest = await req.json()
    
            if (userId === "")
                return res(ctx.status(401), ctx.json({ message: "Unauthorised"}));
            return res(ctx.status(200), ctx.json({ prompt: "s", tag: "s" }));
        }),
    ];
    
    const server = setupServer(...handlers);
    beforeAll(() => server.listen());
    afterEach(() => {
        server.restoreHandlers();
    });

    afterAll(() => server.close());

    it("Should return success response when api request succeeds", async () => {
        const response = await PromptService.postPrompt({
            prompt: "s",
            userId: "7",
            tag: "s"
        });

        expect(response).toEqual({
            prompt: "s",
            tag: "s"
        })
    })

    it("Should throw error when api request fails", async () => {
        let requestFailed = false;
        
        try {
            await PromptService.postPrompt({
                prompt: "s",
                userId: "",
                tag: "s"
            }) 
        } catch (error) {
            requestFailed = true
        }

        expect(requestFailed).toBeTruthy()
    })
})

describe("Prompt service get prompts success test", () => {
    const handlers = [
        rest.get("/api/prompt", async (req, res, ctx) => {
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
        const response = await PromptService.getPrompts();

        expect(response).toEqual({
            prompt: "s",
            tag: "s",
            _id: "7",
            creator: {}
        })
    })
})

describe("Prompt service get prompts failure test", () => {
    const handlers = [
        rest.get("/api/prompt", async (req, res, ctx) => {
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
            await PromptService.getPrompts() 
        } catch (error) {
            requestFailed = true
        }

        expect(requestFailed).toBeTruthy()
    })
})