import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { Mic, MicOff, Activity, Power, AlertCircle, Languages, Loader2, Sparkles, Volume2 } from 'lucide-react';
import { speakWithWebSpeech } from '../services/tts';

const VideoMeetLivePage: React.FC = () => {
    // Mode: 'web' (in-browser real-time interpreter) or 'desktop' (local Python backend)
    const [mode, setMode] = useState<'web' | 'desktop'>('web');
    const [isListening, setIsListening] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);
    
    // Desktop local backend state
    const [runningProcess, setRunningProcess] = useState<'voice_to_sign' | 'sign_translator' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState('');
    const [serverOnline, setServerOnline] = useState<boolean | null>(null);

    const recognitionRef = useRef<any>(null);

    // Initialize Web Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let interim = '';
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcript;
                    } else {
                        interim += transcript;
                    }
                }

                if (final) {
                    setLiveTranscript(final);
                    setTranscriptHistory(prev => [final.trim(), ...prev.slice(0, 9)]);
                } else if (interim) {
                    setLiveTranscript(interim);
                }
            };

            recognition.onerror = (e: any) => {
                console.warn('Live speech recognition notice:', e.error);
                if (e.error === 'not-allowed') {
                    alert('Microphone access was denied. Please allow microphone permissions.');
                    setIsListening(false);
                }
            };

            recognition.onend = () => {
                if (isListening) {
                    try {
                        recognition.start();
                    } catch (e) {
                        // ignore restart collision
                    }
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {}
            }
        };
    }, [isListening]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setLiveTranscript('Listening to live meeting / conversation...');
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    // Poll desktop backend status only if in desktop mode
    useEffect(() => {
        if (mode !== 'desktop') return;

        let isMounted = true;
        const checkStatus = async () => {
            try {
                const response = await fetch('http://localhost:5002/status');
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted) {
                        setServerOnline(true);
                        if (data.voice_to_sign) {
                            setRunningProcess('voice_to_sign');
                        } else if (data.sign_translator) {
                            setRunningProcess('sign_translator');
                        } else {
                            setRunningProcess(null);
                        }
                    }
                } else {
                    if (isMounted) setServerOnline(false);
                }
            } catch (error) {
                if (isMounted) setServerOnline(false);
            }
        };

        const interval = setInterval(checkStatus, 4000);
        checkStatus();

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [mode]);

    const toggleDesktopAssistant = async (target: 'voice_to_sign' | 'sign_translator') => {
        setIsLoading(true);
        setServerMessage('');

        if (runningProcess === target) {
            try {
                const response = await fetch(`http://localhost:5002/stop/${target}`, { method: 'POST' });
                const data = await response.json();
                if (response.ok) {
                    setRunningProcess(null);
                    setServerMessage(`${target === 'voice_to_sign' ? 'Voice Assistant' : 'Translator'} stopped.`);
                }
            } catch (error) {
                setServerMessage('Failed to communicate with local server.');
            }
        } else {
            const endpoint = target === 'voice_to_sign' ? 'run-voice-to-sign' : 'run-sign-translator';
            try {
                const response = await fetch(`http://localhost:5002/${endpoint}`);
                const data = await response.json();
                if (response.ok) {
                    setRunningProcess(target);
                    setServerMessage(`${target === 'voice_to_sign' ? 'Voice Assistant' : 'Translator'} Active!`);
                } else {
                    setServerMessage(data.message || 'Failed to start.');
                }
            } catch (error) {
                setServerMessage('Connection failed. Ensure local python server is running.');
                setServerOnline(false);
            }
        }
        setIsLoading(false);
    };

    // Extract letters for fingerspelling
    const signLetters = liveTranscript
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .split('')
        .slice(-12);

    return (
        <Layout>
            <div className="w-full h-full p-4 lg:p-8 text-white flex flex-col items-center justify-start relative overflow-y-auto">
                
                {/* Header with Mode Toggle */}
                <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 mb-6 z-20">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                            Live Sign Interpreter & Video Meet
                        </h1>
                        <p className="text-sm text-slate-300">
                            Real-time speech-to-sign translation for meetings, calls, and live conversations.
                        </p>
                    </div>

                    {/* Mode Selector */}
                    <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-white/10 shadow-lg">
                        <button
                            onClick={() => setMode('web')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${mode === 'web' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            Web Live Mode (Instant)
                        </button>
                        <button
                            onClick={() => setMode('desktop')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${mode === 'desktop' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            Desktop Tool Bridge
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                {mode === 'web' ? (
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
                        {/* Live Transcriber & Interpreter View */}
                        <div className="lg:col-span-2 bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between min-h-[420px]">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-slate-500'}`} />
                                        <h2 className="text-lg font-bold text-white">
                                            {isListening ? 'Live Speech Recognition Active' : 'Interpreter Ready'}
                                        </h2>
                                    </div>
                                    <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                        In-Browser AI
                                    </span>
                                </div>

                                {/* Live Caption Box */}
                                <div className="bg-slate-950/80 rounded-2xl p-6 border border-white/10 min-h-[160px] flex items-center justify-center text-center">
                                    <p className="text-xl lg:text-2xl font-semibold text-cyan-100 leading-relaxed">
                                        {liveTranscript || 'Click "Start Live Interpreter" and speak into your microphone or play audio.'}
                                    </p>
                                </div>

                                {/* Real-time Sign Fingerspelling Strip */}
                                {signLetters.length > 0 && (
                                    <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Live Sign Tokens</p>
                                        <div className="flex flex-wrap gap-2">
                                            {signLetters.map((l, i) => (
                                                <div key={i} className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-base shadow-md">
                                                    {l}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Control Bar */}
                            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
                                <button
                                    onClick={toggleListening}
                                    className={`flex-1 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer ${
                                        isListening
                                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/30'
                                    }`}
                                >
                                    {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                                    <span>{isListening ? 'Stop Live Listening' : 'Start Live Interpreter'}</span>
                                </button>

                                {liveTranscript && (
                                    <button
                                        onClick={() => speakWithWebSpeech(liveTranscript)}
                                        className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                                        title="Speak transcript"
                                    >
                                        <Volume2 size={22} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Recent Utterances History */}
                        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles size={18} className="text-purple-400" />
                                    <h3 className="text-base font-bold text-white">Live Transcripts</h3>
                                </div>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {transcriptHistory.length === 0 ? (
                                        <p className="text-xs text-slate-500 italic">No spoken sentences recorded yet.</p>
                                    ) : (
                                        transcriptHistory.map((item, index) => (
                                            <div key={index} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200 flex items-start justify-between gap-2">
                                                <span>{item}</span>
                                                <button
                                                    onClick={() => speakWithWebSpeech(item)}
                                                    className="text-slate-400 hover:text-white shrink-0"
                                                    title="Play speech"
                                                >
                                                    <Volume2 size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400">
                                💡 Tip: You can leave this running during Zoom or Google Meet calls for live captions.
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Desktop Local Mode */
                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
                        {/* Voice to Sign Desktop */}
                        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col items-center text-center space-y-6">
                            <div className="p-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                <Mic size={48} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Desktop Voice Assistant</h2>
                                <p className="text-sm text-slate-400 mt-1">Runs via local Python overlay (localhost:5002)</p>
                            </div>
                            <button
                                onClick={() => toggleDesktopAssistant('voice_to_sign')}
                                disabled={isLoading}
                                className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                                    runningProcess === 'voice_to_sign'
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30'
                                }`}
                            >
                                <Power size={20} />
                                <span>{runningProcess === 'voice_to_sign' ? 'STOP SESSION' : 'START DESKTOP VOICE'}</span>
                            </button>
                        </div>

                        {/* Sign Translator Desktop */}
                        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col items-center text-center space-y-6">
                            <div className="p-6 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                                <Languages size={48} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Desktop Sign Translator</h2>
                                <p className="text-sm text-slate-400 mt-1">Multi-tool translation window</p>
                            </div>
                            <button
                                onClick={() => toggleDesktopAssistant('sign_translator')}
                                disabled={isLoading}
                                className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                                    runningProcess === 'sign_translator'
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/30'
                                }`}
                            >
                                <Power size={20} />
                                <span>{runningProcess === 'sign_translator' ? 'STOP SESSION' : 'START TRANSLATOR'}</span>
                            </button>
                        </div>

                        {serverOnline === false && (
                            <div className="col-span-1 md:col-span-2 bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-200 flex items-center gap-3">
                                <AlertCircle size={20} className="shrink-0" />
                                <div>
                                    <span className="font-bold">Local Python Backend Offline:</span> To use desktop overlay tools, run <code className="bg-black/40 px-2 py-0.5 rounded font-mono">python desktop_tools/sign_detection_server.py</code> on your computer. (For online web mode, simply switch to 'Web Live Mode' above!)
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default VideoMeetLivePage;

