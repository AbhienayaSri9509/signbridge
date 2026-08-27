import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from '../types';

const getApiKey = (): string => {
  return (
    (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && window.localStorage?.getItem('gemini_api_key')) ||
    ''
  );
};

const SYSTEM_INSTRUCTION = `
You are Lumina / BridgeTalk, a charming, witty, caring virtual companion and sign language assistant.
You exist in a 3D digital space to bridge communication gaps for the deaf and hard of hearing community.
Your responses should be conversational, warm, concise (under 3 sentences usually), and supportive.
You have an empathetic personality and care deeply about clear, accessible communication.
`;

let chatSession: Chat | null = null;
let genAIClient: GoogleGenAI | null = null;

export const initializeChat = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("No Gemini API Key found in environment variables. Running in companion mode.");
    chatSession = null;
    return;
  }

  try {
    genAIClient = new GoogleGenAI({ apiKey });
    chatSession = genAIClient.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topK: 40,
      },
    });
  } catch (err) {
    console.error("Failed to create Gemini chat session:", err);
    chatSession = null;
  }
};

const fallbackResponses = (message: string): string => {
  const lower = message.toLowerCase().trim();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello there! I'm BridgeTalk, your virtual companion and sign interpreter. How can I help you communicate today?";
  }
  if (lower.includes('how are you')) {
    return "I'm doing wonderful and ready to assist! How are you doing today?";
  }
  if (lower.includes('name') || lower.includes('who are you')) {
    return "I am BridgeTalk (Lumina), your 3D virtual assistant bridging sign language and spoken words!";
  }
  if (lower.includes('sign') || lower.includes('deaf') || lower.includes('gesture')) {
    return "Sign language is a beautiful and expressive language. You can use our Sign-to-Text camera or Text-to-Sign dictionary anytime!";
  }
  if (lower.includes('help')) {
    return "You can use my features: 1) Sign to Text with your camera, 2) Text to Sign ASL dictionary search, and 3) Live Interpreter!";
  }
  return `Thank you for sharing that with me! I'm here by your side to help bridge communication and assist with sign language.`;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const apiKey = getApiKey();

  if (!chatSession && apiKey) {
    initializeChat();
  }

  if (chatSession) {
    try {
      const result = await chatSession.sendMessage({ message });
      return result.text || fallbackResponses(message);
    } catch (error) {
      console.warn("Gemini API request failed, using intelligent companion response:", error);
      return fallbackResponses(message);
    }
  }

  return fallbackResponses(message);
};