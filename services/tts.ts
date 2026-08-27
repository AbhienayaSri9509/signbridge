export type VoiceConfig = {
  languageCode?: string;
  name?: string;
  ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
  rate?: number;
  pitch?: number;
};

// Helper function to speak directly using standard Web Speech API
export const speakWithWebSpeech = (
  text: string,
  config: VoiceConfig = {},
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Web Speech API is not supported in this browser environment.');
      onEnd?.();
      resolve();
      return;
    }

    // Cancel any previous speaking
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) {
      onEnd?.();
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = config.languageCode || 'en-US';
    utterance.rate = config.rate || 1.0;
    utterance.pitch = config.pitch || 1.0;

    // Pick best available voice matching gender/locale if possible
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const match = voices.find(v => {
        const langMatch = v.lang.startsWith(utterance.lang) || v.lang.startsWith(utterance.lang.split('-')[0]);
        if (config.ssmlGender === 'FEMALE') {
          return langMatch && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('google us english'));
        }
        return langMatch;
      }) || voices.find(v => v.lang.startsWith(utterance.lang)) || voices[0];

      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
      resolve();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      onEnd?.();
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Synthesize speech compatible with legacy audioUrl callers.
 * Generates an in-memory silent audio blob and triggers Web Speech API.
 */
export async function synthesizeSpeech(
  text: string,
  config: VoiceConfig = {}
): Promise<string> {
  try {
    // Speak in background using browser speech synthesis
    speakWithWebSpeech(text, config);

    // Generate a short blank WAV data URI for compatibility with new Audio(url).play()
    const blankWavBase64 =
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    return blankWavBase64;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    return '';
  }
}


