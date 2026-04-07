import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const modelsToTry = ["gemini-pro", "gemini-1.5-pro-latest", "gemini-1.0-pro"];

async function run() {
  console.log("Using API Key:", process.env.GEMINI_API_KEY?.slice(0, 5) + "...");
  for (const modelName of modelsToTry) {
    console.log(`Testing model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello?");
      const response = await result.response;
      console.log(`Success with ${modelName}:`, response.text().trim());
    } catch (error: any) {
      console.error(`Error with ${modelName}:`, error.message);
    }
  }
}

run();
