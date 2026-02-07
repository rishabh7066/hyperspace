
import { GoogleGenAI, Type } from "@google/genai";
import { LocationReport, GeminiInsight } from "../types";

// Removed safe environment helpers and lazy initialization to follow strict SDK guidelines.
// Always use the apiKey from process.env.API_KEY directly.

export const generateDisasterInsight = async (report: LocationReport): Promise<GeminiInsight> => {
  try {
    // Create a new GoogleGenAI instance right before making an API call per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = 'gemini-3-pro-preview';

    const prompt = `
      You are an expert disaster management AI for the 'Predictive Sky-X' system in India.
      Analyze the following location report and provide a structured assessment.

      Location: Lat ${report.location.lat}, Lng ${report.location.lng}
      Weather Data:
      - Temperature: ${report.currentWeather.temp}°C
      - Rainfall (Current): ${report.currentWeather.rainfall} mm
      - Wind Speed: ${report.currentWeather.windSpeed} km/h
      - Cloud Cover: ${report.currentWeather.cloudCover}%
      - Pressure: ${report.currentWeather.pressure} hPa

      AI Risk Model Output:
      - Score: ${report.risk.score} (Scale 0-1)
      - Detected Threat: ${report.risk.type}
      - Level: ${report.risk.level}

      Task:
      1. Explain the risk score in simple terms suitable for a dashboard.
      2. Provide 3 specific, actionable recommendations for local authorities or citizens.
      3. Confirm the alert level.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "A concise paragraph explaining the risk situation based on the data.",
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 actionable steps.",
            },
            alertLevel: {
              type: Type.STRING,
              description: "The confirmation of the alert level (Safe, Watch, Emergency).",
            },
          },
          required: ["analysis", "recommendations", "alertLevel"],
        },
      },
    });

    // Accessing .text property directly as it returns string (not a method call)
    if (response.text) {
      const data = JSON.parse(response.text);
      return data as GeminiInsight;
    }

    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      analysis: "Unable to generate real-time AI insight due to network or API constraints. Please rely on standard risk metrics.",
      recommendations: ["Monitor local news channels.", "Keep emergency kits ready.", "Follow standard safety protocols."],
      alertLevel: report.risk.level,
    };
  }
};
