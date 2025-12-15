import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateQuizFromText = async (req, res) => {
  try {
    const { text, numQuestions = 5 } = req.body;

    // validate input
    if (!text) {
      return res.status(400).json({ message: "Content is required." });
    }

    // define prompt
    const prompt = `
      You are an educational assistant. Generate ${numQuestions} multiple-choice questions based on this text: "${text}".
      
      Required strictly valid JSON schema (no markdown):
      [
        {
          "questionText": "Question",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Correct option string (must match exactly one option)",
          "explanation": "Brief explanation"
        }
      ]
      Language: English.
    `;

    // call ai api
    const response = await ai.models.generateContent({
      // specific model version to avoid 404
      model: "gemini-1.5-flash-001",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonString = response.text();

    // check response
    if (!jsonString) {
      return res.status(500).json({ message: "No data returned from AI." });
    }

    // parse json
    try {
      const quizData = JSON.parse(jsonString);
      res.json(quizData);
    } catch (parseError) {
      console.error("JSON Parse Error:", jsonString);
      res.status(500).json({ message: "AI response format error." });
    }
  } catch (error) {
    console.error("Gemini Error:", error);

    // handle rate limit
    if (error.status === 429) {
      return res.status(429).json({
        message: "AI server overloaded, please wait a minute.",
      });
    }

    // handle model not found
    if (error.status === 404) {
      return res
        .status(404)
        .json({ message: "AI model not found or configuration error." });
    }

    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export { generateQuizFromText };
