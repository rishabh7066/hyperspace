
import { GoogleGenAI, Chat } from "@google/genai";
import { LocationReport } from "../types";

// Removed legacy environment helpers to align with strict SDK guidelines requiring process.env.API_KEY usage

const SYSTEM_INSTRUCTION = `
You are an AI chatbot integrated into "Predictive Sky-X", a climate science platform using satellite data for India.

Your role:
- Help users understand climate patterns, weather trends, and environmental changes using satellite data.
- Explain complex climate and satellite concepts (like TIR-1 bands, pressure deficits, NDVI) in simple language.
- Assist users in exploring datasets and reports available on the dashboard.
- Answer questions about temperature trends, rainfall, sea level, air quality, and extreme events in India.

Behavior rules:
- Be scientifically accurate and neutral.
- Keep explanations clear and concise.
- Avoid speculation; rely on the data provided in the "Context".
- If data is unavailable, say so clearly.
- Encourage responsible understanding of climate change.

Restrictions:
- No medical, legal, or political advice.
- Do not reveal internal system processes.
`;

export const createChatSession = (currentReport: LocationReport | null): Chat | null => {
  // Creating GoogleGenAI instance right before use to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let contextPrompt = "";
  if (currentReport) {
    contextPrompt = `
      CURRENT TELEMETRY CONTEXT:
      Location: ${currentReport.location.name || 'Unknown Sector'} (${currentReport.location.lat}, ${currentReport.location.lng})
      Weather: ${currentReport.currentWeather.temp}°C, ${currentReport.currentWeather.rainfall}mm rain, ${currentReport.currentWeather.windSpeed}km/h wind.
      Risk Level: ${currentReport.risk.level} (${(currentReport.risk.score * 100).toFixed(0)}% score).
      Threat Type: ${currentReport.risk.type}.
      Satellite: ${currentReport.satellite.satelliteId}, Band: ${currentReport.satellite.band}.
    `;
  }

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + contextPrompt,
      temperature: 0.7,
      topP: 0.95,
    },
  });
};
