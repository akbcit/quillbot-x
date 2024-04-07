import { OpenAIService } from "./openAI";

const openAIService = new OpenAIService();

export class LLMService {
    async generateTextFromTitleAndDesc(text:string="",title:string,description:string) {
        let phrase = "";
        if(!text){
            phrase = `Given the title "${title}" and the description "${description}", generate one paragraph of quality text that elaborates on the topic.`;
        }
        else{
             phrase = `Given the title "${title}" and the description "${description}" and this ${text} that is a part of the article with that title and description, generate one paragraph of quality text that expand on teh selected text.`;
        }
        const response = await openAIService.generateText(phrase);
        return response;
    }
    async generateImage(prompt: string) {
        const response = await openAIService.generateImage(prompt);
        return response;
    }
}