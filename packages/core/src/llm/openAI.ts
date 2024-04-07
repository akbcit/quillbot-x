import { OpenAI } from 'openai'; // Corrected import statement
import dotenv from "dotenv"
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const openAIInstance = new OpenAI({
    apiKey: apiKey,
});

export class OpenAIService {
    constructor(private openAI: OpenAI = openAIInstance) {

    }

    // Method for generating text
    async generateText(prompt: string, maxTokens: number = 1000, temperature: number = 0.7) {
        try {
            const completion = await this.openAI.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { "role": "system", "content": "You are a helpful assistant." },
                    { "role": "user", "content": prompt }
                ],
                max_tokens: maxTokens,
                temperature: temperature,
            });

            return completion.choices[0].message.content;  
        } catch (error) {
            console.error("Error in text generation:", error);
            return "Error in text generation";  
        }
    }

    // Method for generating images
    async generateImage(prompt: string) {
        try {
            const response = await this.openAI.images.generate({
                prompt: `Generate an image for this: ${prompt}`,
                n: 1,
            });
            const image_url = response.data;
            return image_url;

        } catch (error) {
            console.error("Error in Image generation:", error);
            return (`Error in Image generation`);
        }
    }
}

export const openAIService = new OpenAIService(openAIInstance);
