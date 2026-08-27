export interface TextToSignResult {
  vidRef: string;
  videoUrl: string;
  matchedSentence: string;
  isFingerspelling?: boolean;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8002';

export const runTextToSign = async (userText: string): Promise<TextToSignResult> => {
  const trimmed = userText.trim();
  if (!trimmed) {
    throw new Error('Please enter text to search.');
  }

  // 1. Try local server first if available
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout for fast fallback

    const response = await fetch(`${API_BASE}/text-to-sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: trimmed }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    // Local server is not running (e.g. running on Vercel/cloud)
  }

  // 2. Browser-native ASL resolution
  const cleanQuery = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
  const videoUrl = `https://www.signasl.org/sign/${cleanQuery}`;

  return {
    vidRef: cleanQuery,
    videoUrl: videoUrl,
    matchedSentence: trimmed,
    isFingerspelling: trimmed.length > 20
  };
};



