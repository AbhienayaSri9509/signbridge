import React, { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    Image as ImageIcon,
    Loader2,
    RefreshCw,
    Sparkles,
    Volume2
} from 'lucide-react';
import Layout from '../components/Layout';
import { runTextToSign, TextToSignResult } from '../services/textToSignLocal';
import { speakWithWebSpeech } from '../services/tts';

type GenerationState = 'idle' | 'generating' | 'succeeded' | 'error';

const QUICK_WORDS = [
    'Hello',
    'Thank You',
    'Please',
    'Help',
    'Welcome',
    'Good Morning',
    'Yes',
    'No',
    'Friend',
    'Love',
    'Family',
    'Peace'
];

const TextToSignPage: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [status, setStatus] = useState<GenerationState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<TextToSignResult | null>(null);

    const SignASLEmbed = ({ vidRef, videoUrl, matchedSentence }: { vidRef: string; videoUrl: string; matchedSentence: string }) => {
        useEffect(() => {
            const scriptId = 'signasl-widget-script';
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://embed.signasl.org/widgets.js";
            script.async = true;
            script.charset = "utf-8";
            document.body.appendChild(script);

            return () => {
                try {
                    if (document.body.contains(script)) {
                        document.body.removeChild(script);
                    }
                } catch (e) {
                    console.warn("Retrying script removal", e);
                }
            };
        }, [vidRef]);

        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <blockquote className="signasldata-embed min-h-[220px] flex items-center justify-center" data-vidref={vidRef}>
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-200 underline">
                        Watch how to sign '{matchedSentence}' in American Sign Language
                    </a>
                </blockquote>
                <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                >
                    Open on SignASL Dictionary <ExternalLink size={12} />
                </a>
            </div>
        );
    };

    const generatedPrompt = useMemo(() => {
        if (!inputText.trim()) return 'Select a quick word or type custom text.';
        return `Search for ASL sign: "${inputText.trim()}"`;
    }, [inputText]);

    const handleSearch = async (textToSearch: string) => {
        const query = textToSearch.trim();
        if (!query || status === 'generating') return;

        setInputText(query);
        setError(null);
        setResult(null);
        setStatus('generating');

        try {
            const data = await runTextToSign(query);
            setResult(data);
            setStatus('succeeded');
        } catch (err: any) {
            setStatus('error');
            setError(err?.message || 'Unable to find sign animation.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(inputText);
    };

    const playAudio = () => {
        if (inputText.trim()) {
            speakWithWebSpeech(inputText.trim());
        }
    };

    const statusBadge = () => {
        const base = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide';
        switch (status) {
            case 'generating':
                return (
                    <div className={`${base} bg-amber-500/20 text-amber-200 border border-amber-500/30`}>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Searching...
                    </div>
                );
            case 'succeeded':
                return (
                    <div className={`${base} bg-emerald-500/20 text-emerald-200 border border-emerald-500/30`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sign Ready
                    </div>
                );
            case 'error':
                return (
                    <div className={`${base} bg-rose-500/20 text-rose-200 border border-rose-500/30`}>
                        <AlertCircle className="w-3.5 h-3.5" /> Notice
                    </div>
                );
            default:
                return (
                    <div className={`${base} bg-white/10 text-white/80 border border-white/10`}>
                        <Sparkles className="w-3.5 h-3.5" /> Ready
                    </div>
                );
        }
    };

    // Fingerspelling characters array
    const letters = (result?.matchedSentence || inputText || '')
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .split('');

    return (
        <Layout>
            <div className="h-full w-full flex items-center justify-center p-4 lg:p-10 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl my-auto">
                    {/* Left Column: Input and Quick Words */}
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-purple-300 text-xs uppercase tracking-wider font-bold">Text to Sign</p>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-white">ASL Sign Dictionary</h1>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">
                                Type any word or phrase to translate it into American Sign Language gestures and fingerspelling.
                            </p>

                            <div className="mb-4">{statusBadge()}</div>

                            {/* Quick Suggestion Chips */}
                            <div className="mb-5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Quick ASL Signs</label>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_WORDS.map(word => (
                                        <button
                                            key={word}
                                            type="button"
                                            onClick={() => handleSearch(word)}
                                            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/10 text-slate-200 transition-all cursor-pointer"
                                        >
                                            {word}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Enter custom text</label>
                                    <textarea
                                        className="w-full min-h-[100px] bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
                                        placeholder="e.g. Hello, Thank you, How are you..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        disabled={status === 'generating'}
                                    />
                                </div>

                                <div className="bg-indigo-950/40 border border-indigo-500/20 text-indigo-100 rounded-2xl p-3 text-xs flex items-center justify-between">
                                    <span className="font-medium text-slate-300">{generatedPrompt}</span>
                                    {inputText.trim() && (
                                        <button
                                            type="button"
                                            onClick={playAudio}
                                            className="p-1.5 hover:bg-white/10 rounded-lg text-indigo-300 hover:text-white transition"
                                            title="Listen to pronunciation"
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-200 rounded-2xl p-3 text-xs flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Notice</p>
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={!inputText.trim() || status === 'generating'}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 cursor-pointer text-sm"
                                    >
                                        {status === 'generating' ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-4 h-4" />
                                        )}
                                        Search Sign
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setInputText('');
                                            setStatus('idle');
                                            setError(null);
                                            setResult(null);
                                        }}
                                        className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Result Preview & ASL Fingerspelling */}
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-white/50 font-semibold">Video & Gestures</p>
                                    <h2 className="text-xl font-bold text-white">ASL Sign Visualization</h2>
                                </div>
                                {statusBadge()}
                            </div>

                            {/* Sign Video Player / SignASL Embed */}
                            <div className="min-h-[260px] bg-slate-950/70 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center relative p-4 mb-4">
                                {result?.vidRef ? (
                                    <SignASLEmbed
                                        key={result.vidRef}
                                        vidRef={result.vidRef}
                                        videoUrl={result.videoUrl}
                                        matchedSentence={result.matchedSentence}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-white/40 gap-3 text-center p-6">
                                        {status === 'generating' ? (
                                            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                                        ) : (
                                            <ImageIcon className="w-10 h-10 text-slate-600" />
                                        )}
                                        <p className="text-sm">
                                            {status === 'idle'
                                                ? 'Type a word or click a quick sign on the left to see the ASL sign gesture.'
                                                : 'Searching sign in American Sign Language dictionary...'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ASL Fingerspelling Breakdown */}
                            {letters.length > 0 && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">ASL Fingerspelling</span>
                                        <span className="text-[11px] text-slate-400 font-mono">{letters.length} Letters</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {letters.slice(0, 16).map((char, index) => (
                                            <div
                                                key={index}
                                                className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center font-bold text-indigo-200 text-sm shadow-sm"
                                                title={`Letter ${char}`}
                                            >
                                                {char}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status Footer */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                            <span>ASL Companion</span>
                            <span className="text-indigo-400 font-medium">Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TextToSignPage;

