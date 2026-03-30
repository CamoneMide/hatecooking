import { GoogleGenerativeAI } from "@google/generative-ai";
import { Recipe } from "../store/useRecipeStore";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel(
  {
    model: "gemini-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
    },
  },
  { apiVersion: "v1beta" },
);

export const analyzeFridgeImage = async (
  base64Image: string,
): Promise<{ name: string; quantity: string }[]> => {
  try {
    const prompt = `Analyze this image of a fridge, shelf, or food. Extract all visible raw ingredients and food items. Return ONLY a JSON array of objects, where each object has a 'name' (string) and 'quantity' (string, e.g. '1 unit', '1 bag', 'Full jar'). Keep names concise and capitalized correctly. If no food is detected, return [].`;

    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
    ];

    const result = await geminiModel.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Attempt to parse the JSON array directly
    try {
      const ingredients: { name: string; quantity: string }[] =
        JSON.parse(text);
      return ingredients;
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", text, parseError);
      return [];
    }
    } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateRecipes = async (
  ingredients: string[]
): Promise<Recipe[]> => {
  if (ingredients.length === 0) return [];

  const prompt = `
You are a professional chef AI. I have the following ingredients in my inventory: ${ingredients.join(", ")}.

Generate exactly 5 distinct, delicious recipes I can make primarily using these ingredients. It is perfectly fine if the recipes require a few missing ingredients that I need to buy.

Return the response ONLY as a perfectly formatted JSON array of 5 objects. Each object MUST exactly match this JSON structure:
{
  "id": "unique_string_id",
  "title": "Creative Recipe Title",
  "description": "A short, appetizing 1-2 sentence description of the meal.",
  "difficulty": "Easy", // Must be "Easy", "Medium", or "Hard"
  "prepTime": "30 min",
  "calories": 450, // Number only
  "image": "https://image.pollinations.ai/prompt/delicious%20professional%20food%20photo%20of%20[URL-encoded-recipe-title]?width=800&height=600&nologo=true",
  "tags": ["Dinner", "Healthy"], // 2-3 tags
  "missingIngredients": ["List of 1-4 ingredients needed but not in my inventory"],
  "steps": [
    { "instruction": "Step 1 instruction...", "time": "2 min" },
    { "instruction": "Step 2 instruction...", "time": "15 min" }
  ] // 4-6 actionable steps, each with an estimated individual step time
}

Ensure the output is raw JSON data without markdown formatting blocks.
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    if (text.startsWith("\`\`\`json")) {
      text = text.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
    }

    try {
      const recipes: Recipe[] = JSON.parse(text);
      return recipes;
    } catch (parseError) {
      console.error("Failed to parse Gemini recipes JSON:", text, parseError);
      return [];
    }
  } catch (error) {
    console.error("Gemini Recipe Generation Error:", error);
    throw error;
  }
};
