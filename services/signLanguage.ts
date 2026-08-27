// Sign Language Processing Service
// Supports Gemini Vision AI (Cloud / Web) and Local YOLO Model (Desktop)
import { GoogleGenAI } from "@google/genai";

type SupportedLanguage = 'en' | 'ta';

const getApiKey = (): string => {
  return (
    (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && window.localStorage?.getItem('gemini_api_key')) ||
    ''
  );
};

export const processSignLanguageImage = async (
  imageBase64: string,
  language: SupportedLanguage = 'en',
  mode: 'online' | 'offline' = 'online'
): Promise<string> => {
  // If offline mode is explicitly requested, try local YOLO first
  if (mode === 'offline') {
    try {
      const localResult = await processLocalYoloImage(imageBase64);
      if (localResult) return localResult;
    } catch (e) {
      console.warn("Local YOLO server unreachable, falling back to online AI recognition...");
    }
  }

  // Try Online Gemini Vision Recognition
  const apiKey = getApiKey();
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = language === 'ta'
        ? "Analyze this webcam frame for sign language gestures. If a sign or gesture is detected, translate it into a simple Tamil word. If no clear gesture is present, return 'None'. Return only the word."
        : "Analyze this webcam frame for American Sign Language (ASL) or hand gestures. If you detect an ASL sign or gesture (like Hello, Thank You, Yes, No, I Love You, Peace, Thumbs Up, or letters A-Z), return ONLY the single word or short phrase. If no clear hand gesture is visible, return 'None'. Return strictly the word/phrase with no punctuation.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      });

      const detected = response.text?.trim();
      if (detected && detected.toLowerCase() !== 'none' && !detected.toLowerCase().includes('no clear')) {
        return detected.replace(/^["']|["']$/g, '');
      }
    } catch (geminiErr) {
      console.warn("Gemini Vision processing error:", geminiErr);
    }
  }

  // If online didn't return a result, try local YOLO as fallback
  try {
    const localResult = await processLocalYoloImage(imageBase64);
    if (localResult) return localResult;
  } catch (err) {
    // Both unavailable or no sign detected
  }

  return '';
};

const processLocalYoloImage = async (imageBase64: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:5001/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      throw new Error(`Local Server Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    throw error;
  }
};

