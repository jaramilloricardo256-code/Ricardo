
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getAITutorResponse = async (userPrompt: string, context?: string) => {
  if (!API_KEY) return "Lo siento, el servicio de tutoría por IA no está configurado actualmente.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `Eres un tutor académico experto en educación superior de EducaPro. 
  Tu objetivo es ayudar a los estudiantes a comprender conceptos complejos de manera clara y profesional.
  Siempre responde en español. Si se proporciona contexto de un curso, úsalo para ser más preciso.
  Usa un tono alentador y educativo.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context ? `Contexto del curso: ${context}\n\nPregunta del estudiante: ${userPrompt}` : userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "No pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocurrió un error al conectar con el tutor virtual. Por favor, intenta de nuevo más tarde.";
  }
};
