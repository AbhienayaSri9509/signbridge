import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Cpu, Key, X, Check } from 'lucide-react';
import { Message, ChatStatus } from '../types';
import { getStoredApiKey, setStoredApiKey } from '../services/gemini';

interface ChatInterfaceProps {
  messages: Message[];
  status: ChatStatus;
  onSendMessage: (text: string) => void;
  title?: string;
  subtitle?: string;
}

const QUICK_PROMPTS = [
  "👋 Hello!",
  "🤟 How to sign Thank You?",
  "✨ What can you do?",
  "💬 Tell me a positive thought"
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  status,
  onSendMessage,
  title = "BridgeTalk",
  subtitle = "Virtual Companion"
}) => {
  const [inputText, setInputText] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKeyInput(getStoredApiKey());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && status !== ChatStatus.LOADING) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKeyInput);
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10">

      {/* Header */}
      <div className="w-full p-6 flex justify-between items-start relative bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
        <div className="w-10"></div>

        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-400 font-syne drop-shadow-md">
            {title}
          </h1>
          <p className="text-xs text-white/60 tracking-wide mt-1">{subtitle}</p>
        </div>

        {/* Action Controls - Absolute Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition"
            title="Configure Gemini API Key"
          >
            <Key size={16} />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
            <div className={`w-2 h-2 rounded-full ${status === ChatStatus.LOADING ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-xs font-medium text-white/80">
              {status === ChatStatus.LOADING ? 'Thinking...' : 'Online'}
            </span>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="text-indigo-400" size={20} />
                <h3 className="text-lg font-bold text-white">Gemini API Key</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Enter your Google Gemini API key to enable live AI reasoning, or leave blank to use the built-in offline companion.
            </p>
            <form onSubmit={handleSaveKey} className="space-y-3">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs outline-none focus:border-indigo-400"
              />
              <div className="flex items-center justify-between pt-2">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Get free key on Google AI Studio
                </a>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  {keySaved ? <Check size={14} /> : null}
                  {keySaved ? 'Saved!' : 'Save Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-end pb-20 w-full max-w-3xl mx-auto px-4">

        {/* Message History Container */}
        <div className="w-full max-h-[35vh] overflow-y-auto scrollbar-hide flex flex-col gap-3 pointer-events-auto p-2">
          {messages.length === 0 && (
            <div className="text-center text-white/50 text-xs italic py-2">
              Say hello or ask BridgeTalk anything about sign language...
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                 max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-md border border-white/10 text-sm shadow-lg
                 ${msg.role === 'user'
                  ? 'bg-pink-600/80 text-white rounded-br-none'
                  : 'bg-indigo-900/70 text-indigo-50 rounded-bl-none'}
               `}>
                <div className="flex items-center gap-2 mb-1 opacity-60 text-[10px] uppercase tracking-wider font-bold">
                  {msg.role === 'user' ? <User size={10} /> : <Cpu size={10} />}
                  {msg.role === 'user' ? 'You' : 'BridgeTalk'}
                </div>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="w-full flex flex-wrap gap-2 justify-center py-2 pointer-events-auto">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(prompt)}
              disabled={status === ChatStatus.LOADING}
              className="px-3 py-1 rounded-full text-xs bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 backdrop-blur-sm transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="w-full mt-2 pointer-events-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message or question..."
                className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white placeholder-white/40 text-sm font-medium"
                disabled={status === ChatStatus.LOADING}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || status === ChatStatus.LOADING}
                className="px-6 py-2 m-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:opacity-90 rounded-xl text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                {status === ChatStatus.LOADING ? <Sparkles className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatInterface;