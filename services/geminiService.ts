
import { GoogleGenAI, Type } from "@google/genai";
import { ClimateDataPoint, AIAnalysisResponse, Scenario } from "../types";

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
    if (ai) return ai;
    
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("Gemini API Key is missing");
        return null;
    }
    
    try {
        ai = new GoogleGenAI({ apiKey });
        return ai;
    } catch (e) {
        console.error("Failed to initialize Gemini Client", e);
        return null;
    }
};

export const analyzeClimateData = async (
  data: ClimateDataPoint[],
  scenario: Scenario
): Promise<AIAnalysisResponse> => {
  const client = getAIClient();
  if (!client) {
      throw new Error("Gemini API Key is not configured. Please check your settings.");
  }

  // Extract summary statistics
  const currentYearData = data.find(d => d.year === 2023) || data[data.length - 1];
  const startData = data[0];
  const finalData = data[data.length - 1];
  
  const isFuture = scenario !== Scenario.HISTORICAL;

  const prompt = `
    You are a senior climate research scientist specializing in Urban Heat Islands (UHI) and Asian climatology.
    You are analyzing data for a presentation on "Taipei's Urban Heat Island Effect".

    Data Context:
    - 1880 Base Anomaly: Global ~${startData.globalAnomaly}°C, Taipei ~${startData.taipeiAnomaly}°C
    - 2023 Current Anomaly: Global ~${currentYearData.globalAnomaly}°C, Taipei ~${currentYearData.taipeiAnomaly}°C
    
    Simulation Scenario: ${scenario}
    ${isFuture ? `- Projection Year: ${finalData.year}` : ''}
    ${isFuture ? `- Projected Taipei Anomaly: ~${finalData.taipeiAnomaly}°C` : ''}

    Task:
    1. Summarize the trend, specifically explaining why Taipei's curve diverges from the global average (Basin topography, lack of wind, concrete density).
    2. If this is a Future Scenario (${scenario}), explain the specific implications by 2050 (e.g., Optimistic = effectiveness of green corridors; BAU = severe heat stress/grid failure).
    3. Provide 3 highly scientific key factors driving this.
    4. Provide 3 actionable, policy-level recommendations tailored to this scenario.

    Output as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarioContext: { type: Type.STRING, description: "A brief header describing the scenario analyzed (e.g. '2050 Business As Usual Projection')" },
            summary: { type: Type.STRING },
            keyFactors: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["scenarioContext", "summary", "keyFactors", "recommendations"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No data returned from AI");
    
    return JSON.parse(resultText) as AIAnalysisResponse;

  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    throw new Error("Failed to analyze climate data.");
  }
};
