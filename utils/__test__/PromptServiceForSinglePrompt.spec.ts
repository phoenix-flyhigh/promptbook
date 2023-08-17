import { CreatePromptRequest } from "@/app/create-post/page";
import { rest } from "msw";
import { setupServer } from "msw/node";
import PromptService from "../PromptService";

describe("Prompt service for single prompts tests", () => {
    let mockId = "7";
    const getPromptSuccessResponse: any = {
        prompt: "s",
        tag: "s",
        _id: "7",
        creator: {}
    };

    const handlers = [
        rest.patch(`/api/prompt/7`, async (req, res, ctx) => {
            const { prompt, tag }: Omit<CreatePromptRequest, 'userId'> = await req.json()

            return res(ctx.status(200), ctx.json({ prompt: prompt, tag: tag }));
        }),
        rest.patch(`/api/prompt/6`, async (req, res, ctx) => {
            return res(ctx.status(500), ctx.json({ message: "Internal server error" }));
        }),

        rest.get(`/api/prompt/7`, async (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(getPromptSuccessResponse));
        }),
        rest.get(`/api/prompt/6`, async (req, res, ctx) => {
            return res(ctx.status(500), ctx.json({ message: "Internal server error" }));
        }),

        rest.delete(`/api/prompt/7`, async (req, res, ctx) => {
            return res(ctx.status(200), ctx.json("Successfully deleted"));
        }),
        rest.delete(`/api/prompt/6`, async (req, res, ctx) => {
            return res(ctx.status(500), ctx.json({ message: "Internal server error" }));
        }),
    ];

    const server = setupServer(...handlers);
    beforeAll(() => server.listen());
    afterEach(() => {
        server.restoreHandlers();
    });

    afterAll(() => server.close());

    it("Should return post if get prompt request succeeds", async () => {
        const response = await PromptService.getPrompt("7")

        expect(response).toEqual(getPromptSuccessResponse)
    })

    it("Should throw error if get prompt request fails", async () => {
        let requestFailed = false;

        try {
            await PromptService.getPrompt("6")
        } catch (error) {
            requestFailed = true
        }

        expect(requestFailed).toBeTruthy()
    })

    it("Should return post if update prompt request succeeds", async () => {
        const response = await PromptService.updatePrompt("7", {
            prompt: "s",
            tag: "s"
        })

        expect(response).toEqual( {
            prompt: "s",
            tag: "s"
        })
    })

    it("Should throw error if update prompt request fails", async () => {
        let requestFailed = false;

        try {
            await PromptService.updatePrompt("6", {
                prompt: "s",
                tag: "s"
            })
        } catch (error) {
            requestFailed = true
        }

        expect(requestFailed).toBeTruthy()
    })

    it("Should return success msg if delete prompt request succeeds", async () => {
        const response = await PromptService.deletePrompt("7");

        expect(response).toEqual("Successfully deleted")
    })

    it("Should throw error if delete prompt request fails", async () => {
        let requestFailed = false;

        try {
            await PromptService.deletePrompt("6")
        } catch (error) {
            requestFailed = true
        }

        expect(requestFailed).toBeTruthy()
    })
})