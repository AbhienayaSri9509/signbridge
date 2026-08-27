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

  // Smart word normalizer for common greetings and phrases
  let normalizedQuery = trimmed.toLowerCase();
  if (/^hi+$/i.test(normalizedQuery)) normalizedQuery = 'hello';
  else if (/^he+l+o+$/i.test(normalizedQuery)) normalizedQuery = 'hello';
  else if (/^(thx|tysm|thanx)$/i.test(normalizedQuery)) normalizedQuery = 'thank you';
  else if (/^pls|plz$/i.test(normalizedQuery)) normalizedQuery = 'please';
  else if (/^gm$/i.test(normalizedQuery)) normalizedQuery = 'good morning';

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isLocalBase = API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');

  // 1. Only try local server when running in local HTTP development
  if (!isHttps || !isLocalBase) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

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
      // Local server not available, seamlessly continue to web resolution
    }
  }

  // 2. Browser-native ASL resolution with SignASL index
  const cleanQuery = normalizedQuery.replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
  const videoUrl = `https://www.signasl.org/sign/${cleanQuery}`;

  return {
    vidRef: cleanQuery,
    videoUrl: videoUrl,
    matchedSentence: trimmed,
    isFingerspelling: trimmed.length > 15
  };
};




