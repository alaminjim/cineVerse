import dotenv from "dotenv";

dotenv.config();

/**
 * AI Service: Handles all AI capabilities via an open model provider (Pollinations AI)
 * - CineBuddy chatbot (conversational, like ChatGPT)
 * - Movie recommendations
 * - Synopsis generation
 * - Search suggestions
 */

const generateWithOpenModel = async (systemPrompt: string, userPrompt: string, history: any[] = []): Promise<string> => {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((msg) => ({
      role: msg.role === "bot" || msg.role === "assistant" ? "assistant" : "user",
      content: msg.content
    })),
    { role: "user", content: userPrompt }
  ];

  try {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        model: "openai", // Uses a fast reliable open model provided by Pollinations
        seed: Math.floor(Math.random() * 1000000)
      })
    });

    if (!response.ok) {
      throw new Error(`Open model API error: ${response.statusText}`);
    }

    const text = await response.text();
    return text.trim();
  } catch (error: any) {
    console.error("Open Model API Error:", error.message);
    throw new Error("Our AI engines are currently cooling down. Please try again in a moment.");
  }
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
    return await generateWithOpenModel(prompt, userMessage, conversationHistory);
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
    const text = await generateWithOpenModel("You are a search assistant that only responds in valid JSON format.", prompt);
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
  const systemPrompt = "Analyze the following movie review for offensive language. Respond ONLY with SAFE or FLAGGED.";
  
  return await generateWithOpenModel(systemPrompt, prompt);
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

  const text = await generateWithOpenModel("You are an AI that only returns valid JSON arrays of strings.", finalPrompt);
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
  const prompt = `Generate an engaging 2-3 sentence synopsis for "${title}" by "${director}".`;
  return await generateWithOpenModel("You are an expert movie reviewer.", prompt);
};

export const aiService = {
  analyzeReviewSentiment,
  generateMovieRecommendation,
  generateSynopsis,
  chatWithCineBuddy,
  getSearchSuggestions,
};
