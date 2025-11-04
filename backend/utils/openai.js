import dotenv from   "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
export const getOpenAIAPIResponse = async (messsage) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: messsage,
  });

  const data = response.text;
  return data;
};
  