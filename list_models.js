import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY not found in environment variables");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("Fetching models...");
        const response = await ai.models.list();
        console.log("Response Type:", typeof response);
        console.log("Response Keys:", Object.keys(response));
        if (response) {
            console.log("Response:", JSON.stringify(response, null, 2));
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
