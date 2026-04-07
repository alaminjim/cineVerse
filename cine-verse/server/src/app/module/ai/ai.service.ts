import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const modelsToTry = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash-exp",
];

/**
 * AI Service: Handles all communication with Google Gemini.
 */

const generateWithFallback = async (prompt: string): Promise<string> => {
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (err: any) {
      console.warn(`AI Model ${modelName} failed:`, err.message);
      lastError = err;
    }
  }

  throw (
    lastError ||
    new Error("All AI models failed. Please check your API key permissions.")
  );
};

const analyzeReviewSentiment = async (content: string) => {
  const prompt = `
    Analyze the following movie review for offensive language.
    Safe -> SAFE, Unsafe -> FLAGGED.
    Review: "${content}"
  `;
  return await generateWithFallback(prompt);
};

const generateMovieRecommendation = async (
  userInterests: string[],
  allMovies: string[],
  promptInput?: string,
) => {
  let basePrompt = "";

  if (promptInput) {
    basePrompt = `User asks: "${promptInput}". Recommendation from: ${allMovies.join(", ")}`;
  } else {
    basePrompt = `Preferences: ${userInterests.join(", ")}. Recommendation from: ${allMovies.join(", ")}`;
  }

  const finalPrompt = `
    ${basePrompt}
    Recommend 3 movies as a JSON array of strings: ["Title A", "Title B", "Title C"].
  `;

  const text = await generateWithFallback(finalPrompt);
  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  const jsonMatch = cleanText.match(/\[.*\]/s);
  try {
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (err) {
    console.error("AI JSON Parse Error:", err);
    return [];
  }
};

const generateSynopsis = async (title: string, director: string) => {
  const prompt = `Engaging 2-3 sentence synopsis for "${title}" by "${director}".`;
  return await generateWithFallback(prompt);
};

export const aiService = {
  analyzeReviewSentiment,
  generateMovieRecommendation,
  generateSynopsis,
};
