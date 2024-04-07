import { Hono } from "hono";
import { handle } from 'hono/aws-lambda';
import { LLMService } from "../../core/src/llm/llmService";

const app = new Hono();

const llmService = new LLMService();

app.get("/createTextContent", async (c) => {
    const title = c.req.query('title');
    const description = c.req.query('description');
    const text = c.req.query('description')?c.req.query('description'):"";
    let response;
    if (title&&description) {
        response = await llmService.generateTextFromTitleAndDesc(text,title,description);
    }
    return c.json({response:response});
})

app.get("/createImage", async (c) => {
    const prompt = c.req.query('prompt');
    if (prompt) {
        const response = await llmService.generateImage(prompt) as { url: string }[];
        try{
            if(response.length > 0 && response[0].url){
                return c.json({url:response[0].url});
            }
        }
        catch(err){
            console.log(err);
        }
    }
    // Fallback URL if no prompt is provided, or no response, or response lacks a URL
    return c.json({url: "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"});
});


export const handler = handle(app);