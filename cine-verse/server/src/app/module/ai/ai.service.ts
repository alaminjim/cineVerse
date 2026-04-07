import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const modelsToTry = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

/**
 * AI Service: Handles all communication with Google Gemini.
 * - CineBuddy chatbot (conversational)
 * - Movie recommendations
 * - Synopsis generation
 * - Search suggestions
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

/**
 * CineBuddy Chat – Conversational AI for movie discussions
 */
const chatWithCineBuddy = async (
  userMessage: string,
  conversationHistory: { role: string; content: string }[],
  availableMovies: string[],
  userInterests: string[]
): Promise<string> => {
  const historyContext = conversationHistory
    .slice(-6) // last 6 messages for context
    .map((msg) => `${msg.role === "user" ? "User" : "CineBuddy"}: ${msg.content}`)
    .join("\n");

  const prompt = `You are CineBuddy, a friendly, witty AI film expert assistant for CineVerse — a premium movie streaming & review platform.

Your personality:
- You're passionate about cinema and love talking about movies
- You use fun movie references and film terminology naturally
- You're helpful, enthusiastic, and sometimes use movie-themed humor
- You keep responses concise (2-4 sentences max unless asked for details)
- You format responses with line breaks for readability when listing items
- You use emojis sparingly but effectively 🎬🍿🎥

Your capabilities:
- Recommend movies based on mood, genre, or preferences
- Discuss movie plots, actors, directors, cinematography
- Help users navigate CineVerse features (watchlist, reviews, subscriptions)
- Share fun movie trivia and behind-the-scenes facts
- Compare movies and suggest similar titles

Available movies on our platform: ${availableMovies.slice(0, 30).join(", ")}
${userInterests.length > 0 ? `User's watched/interested: ${userInterests.join(", ")}` : ""}

${historyContext ? `Recent conversation:\n${historyContext}` : ""}

User says: "${userMessage}"

Respond naturally as CineBuddy. If the user asks about a movie not on our platform, you can still discuss it but mention they can find similar titles on CineVerse. Never break character. Never use markdown headers or bullet point symbols like * or -. Use plain text with line breaks.`;

  try {
    return await generateWithFallback(prompt);
  } catch (err: any) {
    // Graceful fallback for common questions
    const lower = userMessage.toLowerCase();
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hey there, movie lover! 🎬 I'm CineBuddy, your personal film expert. What kind of movie are you in the mood for today?";
    }
    if (lower.includes("recommend") || lower.includes("suggest")) {
      return `Great question! 🍿 Based on our collection, I'd suggest checking out ${availableMovies.slice(0, 3).join(", ")}. Want me to narrow it down by genre or mood?`;
    }
    throw err;
  }
};

/**
 * Search suggestions powered by AI
 */
const getSearchSuggestions = async (
  query: string,
  availableMovies: string[]
): Promise<string[]> => {
  const prompt = `Given the search query "${query}" and these available movies: ${availableMovies.join(", ")}.

Return the top 5 most relevant movie titles as a JSON array of strings. Only include titles from the provided list.
If no matches, return an empty array. Example: ["Movie A", "Movie B"]
Return ONLY the JSON array, nothing else.`;

  try {
    const text = await generateWithFallback(prompt);
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const jsonMatch = cleanText.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch {
    return [];
  }
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
  promptInput?: string
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
  chatWithCineBuddy,
  getSearchSuggestions,
};
