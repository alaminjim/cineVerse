import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * AI Service: Handles all communication with Google Gemini.
 * Explained for User: 
 * - Eta holo CineVerse er AI brain. 
 * - "analyzeReviewSentiment" review check kore offensive kina.
 * - "generateMovieRecommendation" user er taste onujayi movie bole dey.
 */

const analyzeReviewSentiment = async (content: string) => {
  const prompt = `
    Analyze the following movie review for offensive language, hate speech, or spam.
    If the review is safe, return exactly the word "SAFE".
    If the review contains offensive language or is harmful, return exactly the word "FLAGGED".
    
    Review Content: "${content}"
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

const generateMovieRecommendation = async (userInterests: string[], allMovies: string[]) => {
  const prompt = `
    Based on the user's preferred genres/movies: ${userInterests.join(", ")},
    recommend 3 movies from the following list that they would enjoy:
    ${allMovies.join(", ")}
    
    Return the result as a JSON array of strings containing only the movie titles.
    Example: ["Movie A", "Movie B", "Movie C"]
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Basic JSON extraction
  const jsonMatch = text.match(/\[.*\]/s);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
};

const generateSynopsis = async (title: string, director: string) => {
  const prompt = `
    Write a short, engaging 2-3 sentence synopsis for a movie titled "${title}" directed by "${director}".
    Make it sound like a professional movie description.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

export const aiService = {
  analyzeReviewSentiment,
  generateMovieRecommendation,
  generateSynopsis,
};
