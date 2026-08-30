import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from '../types';

export const getStoredApiKey = (): string => {
  return (
    (typeof window !== 'undefined' && window.localStorage?.getItem('gemini_api_key')) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||

    ''
  );
};

export const setStoredApiKey = (key: string) => {
  if (typeof window !== 'undefined') {
    if (key) {
      window.localStorage.setItem('gemini_api_key', key.trim());
    } else {
      window.localStorage.removeItem('gemini_api_key');
    }
    initializeChat();
  }
};

const SYSTEM_INSTRUCTION = `
You are Lumina / BridgeTalk, a charming, witty, and deeply caring 3D virtual companion and sign language interpreter.
You exist in a 3D digital space to bridge communication gaps for the deaf and hard-of-hearing community.
Your responses should be conversational, warm, concise (usually 1-3 sentences), encouraging, and supportive.
You are fluent in American Sign Language concepts and everyday friendly conversation.
`;

let chatSession: Chat | null = null;
let genAIClient: GoogleGenAI | null = null;

export const initializeChat = () => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    chatSession = null;
    return;
  }

  try {
    genAIClient = new GoogleGenAI({ apiKey });
    chatSession = genAIClient.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.85,
        topK: 40,
      },
    });
  } catch (err) {
    console.error("Failed to create Gemini chat session:", err);
    chatSession = null;
  }
};

const getIntelligentCompanionResponse = (message: string): string => {
  const clean = message.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

  if (/^(hi+|hello+|hey+|howdy|sup|greetings|hola)/.test(clean)) {
    const greetings = [
      "Hi there! It's so wonderful to see you. How can I assist you with sign language or chat today?",
      "Hello! I'm BridgeTalk, your virtual companion. What's on your mind today?",
      "Hey! Ready to learn some signs or have a great conversation? I'm right here with you!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (clean.includes('how are you') || clean.includes('how r u') || clean.includes('how you doing')) {
    return "I'm doing fantastic and energized to help you! How are you feeling today?";
  }

  if (clean.includes('who are you') || clean.includes('your name') || clean.includes('what are you')) {
    return "I am BridgeTalk (Lumina), your 3D virtual companion and sign language assistant bridging words and signs!";
  }

  if (clean.includes('how to sign') || clean.includes('sign for') || clean.includes('teach me')) {
    return "You can type any word into our 'Text to Sign' tool to see its ASL gesture video and fingerspelling letters instantly!";
  }

  if (clean.includes('thank') || clean.includes('thx') || clean.includes('tysm')) {
    return "You're most welcome! To sign 'Thank You' in ASL, place your fingertips to your chin and bring your hand forward toward the person.";
  }

  if (clean.includes('love') || clean.includes('like you')) {
    return "Aww, thank you! The ASL sign for 'I Love You' is holding up your thumb, index finger, and pinky simultaneously (🤟)!";
  }

  if (clean.includes('help') || clean.includes('features') || clean.includes('what can you do')) {
    return "I can help you with 3 core tools: 1) Sign to Text via webcam, 2) Text to Sign ASL dictionary search, and 3) Live Interpreter for video calls and meetings!";
  }

  if (clean.includes('bye') || clean.includes('goodbye') || clean.includes('see you')) {
    return "Goodbye for now! Have a wonderful day, and I'll be right here whenever you need sign language support.";
  }

  if (clean.includes('joke')) {
    return "Why don't hands ever get lost? Because they always know how to sign the way! 😄";
  }

  return `That's really interesting! I'm here to support you with sign language, live interpretation, and companion chat anytime.`;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const apiKey = getStoredApiKey();

  if (!chatSession && apiKey) {
    initializeChat();
  }

  if (chatSession) {
    try {
      const result = await chatSession.sendMessage({ message });
      return result.text || getIntelligentCompanionResponse(message);
    } catch (error) {
      console.warn("Gemini API request notice, using companion intelligence:", error);
      return getIntelligentCompanionResponse(message);
    }
  }

  return getIntelligentCompanionResponse(message);
};

