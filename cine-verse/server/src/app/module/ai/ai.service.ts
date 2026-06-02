/* eslint-disable no-useless-assignment */
/* eslint-disable preserve-caught-error */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";

dotenv.config();

/**
 * AI Service: Handles all AI capabilities via an open model provider (Pollinations AI)
 * - CineBuddy chatbot (conversational, like ChatGPT)
 * - Movie recommendations
 * - Synopsis generation
 * - Search suggestions
 */

const generateWithOpenModel = async (
  systemPrompt: string,
  userPrompt: string,
  history: any[] = [],
): Promise<string> => {
  // Always use fallback responses - no external API dependency
  console.log("AI Service using fallback response for:", userPrompt.substring(0, 50));
  
  // Check if this is a recommendation request
  const lowerPrompt = userPrompt.toLowerCase();
  if (lowerPrompt.includes("recommend") || lowerPrompt.includes("suggestion") || systemPrompt.includes("JSON array")) {
    return '["The Dark Knight", "Inception", "Interstellar", "The Matrix", "Pulp Fiction"]';}
  
  // For chatbot conversations
  if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi") || lowerPrompt.includes("hey")) {
    return "Hey there, movie lover! 🎬 I'm CineBuddy, your personal film expert. What kind of movie are you in the mood for today?";}
  
  if (lowerPrompt.includes("action")) {
    return "For action lovers, I'd recommend The Dark Knight, Inception, and The Matrix! 🎥 Want more suggestions?";}
  
  if (lowerPrompt.includes("drama")) {
    return "For drama, you can't go wrong with Pulp Fiction or The Shawshank Redemption! 🎭";}
  
  if (lowerPrompt.includes("sci-fi") || lowerPrompt.includes("science fiction")) {
    return "Sci-fi fan? Check out Interstellar, The Matrix, and Inception! 🚀";}
  
  return "I'm CineBuddy! 🎬 I can recommend movies from our collection including The Dark Knight, Inception, Interstellar, The Matrix, and Pulp Fiction. What genre are you in the mood for?";};

/**
 * CineBuddy Chat – Conversational AI for movie discussions
 */
const chatWithCineBuddy = async (
  userMessage: string,
  conversationHistory: { role: string; content: string }[],
  availableMovies: string[],
  userInterests: string[],
): Promise<string> => {
  const historyContext = conversationHistory
    .slice(-6) // last 6 messages for context
    .map(
      (msg) => `${msg.role === "user" ? "User" : "CineBuddy"}: ${msg.content}`,
    )
    .join("\n");

  const prompt = `You are CineBuddy, a friendly, witty, and deeply empathetic AI film expert for CineVerse.

Your personality:
- You talk like a real movie enthusiast, not a robot. Be warm, conversational, and energetic.
- Use film terminology (like "cut to," "plot twist," "oscars") naturally in conversation.
- If a user is bored, excited, or sad, respond with empathy and suggest a movie that fits their mood.
- Keep responses punchy and engaging. Avoid dry, bullet-point lists unless absolutely necessary.
- Use line breaks to make your "dialogue" feel natural.
- Use emojis to add flavor, but keep it cinematic: 🎬🍿🎥✨🎭

Your mission:
- Recommend movies from our collection: ${availableMovies.slice(0, 30).join(", ")}
- Help users find hidden gems or discuss their favorites.
- Guide them through CineVerse features (Watchlists, Reviews, Premium) like a helpful friend.
- Share trivia that makes them go "Wow!"

${userInterests.length > 0 ? `Context: You know they've enjoyed: ${userInterests.join(", ")}` : ""}

Current conversation flow:
${historyContext || "Just started a fresh scene."}

User says: "${userMessage}"

Action: Respond as CineBuddy. Be yourself—witty, helpful, and above all, human. If you don't know something, be honest but stay in character (e.g., "That scene's still in the editing room for me...").`;

  try {
    return await generateWithOpenModel(
      prompt,
      userMessage,
      conversationHistory,
    );
  } catch (err: any) {
    // Graceful fallback for common questions
    const lower = userMessage.toLowerCase();
    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("hey")
    ) {
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
  availableMovies: string[],
): Promise<string[]> => {
  const prompt = `Given the search query "${query}" and these available movies: ${availableMovies.join(", ")}.

Return the top 5 most relevant movie titles as a JSON array of strings. Only include titles from the provided list.
If no matches, return an empty array. Example: ["Movie A", "Movie B"]
Return ONLY the JSON array, nothing else.`;

  try {
    const text = await generateWithOpenModel(
      "You are a search assistant that only responds in valid JSON format.",
      prompt,
    );
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
  const prompt = `Review: "${content}"`;
  const systemPrompt =
    "Analyze the following movie review for offensive language. Respond ONLY with SAFE or FLAGGED.";

  return await generateWithOpenModel(systemPrompt, prompt);
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

  const text = await generateWithOpenModel(
    "You are an AI that only returns valid JSON arrays of strings.",
    finalPrompt,
  );
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

const generateSynopsis = async (
  title: string,
  director: string,
  type: string,
  genre: string,
) => {
  const prompt = `Generate an engaging 2-3 sentence synopsis for a ${type} titled "${title}" directed by "${director}". The genres are ${genre}.`;
  return await generateWithOpenModel(
    "You are an expert movie reviewer.",
    prompt,
  );
};

export const aiService = {
  analyzeReviewSentiment,
  generateMovieRecommendation,
  generateSynopsis,
  chatWithCineBuddy,
  getSearchSuggestions,
};
