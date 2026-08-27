import React, { useState, useEffect, useCallback } from 'react';
import Experience from '../components/Experience';
import ChatInterface from '../components/ChatInterface';
import SignLanguageCamera from '../components/SignLanguageCamera';
import SignLanguageResponse from '../components/SignLanguageResponse';
import { sendMessageToGemini, initializeChat } from '../services/gemini';
import { speakWithWebSpeech } from '../services/tts';
import { Message, ChatStatus, AvatarState } from '../types';
import Layout from '../components/Layout';

const SignToTextPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<ChatStatus>(ChatStatus.IDLE);
    const [detectedSignText, setDetectedSignText] = useState<string>('');
    const [avatarState, setAvatarState] = useState<AvatarState>({
        isThinking: false,
        isTalking: false,
        mood: 'neutral'
    });

    // Initialize chat on mount
    useEffect(() => {
        initializeChat();
    }, []);

    const handleSignDetected = useCallback((text: string) => {
        setDetectedSignText(text);
    }, []);

    const playSignAudio = useCallback((text: string) => {
        speakWithWebSpeech(
            text,
            { languageCode: 'en-US', ssmlGender: 'FEMALE' },
            () => setAvatarState(prev => ({ ...prev, isTalking: true })),
            () => setAvatarState(prev => ({ ...prev, isTalking: false }))
        );
    }, []);

    const handleSignProcessing = useCallback((isProcessing: boolean) => {
        setAvatarState(prev => ({
            ...prev,
            isThinking: isProcessing
        }));
    }, []);

    const handleSendMessage = useCallback(async (text: string) => {
        // Add user message immediately
        const userMessage: Message = {
            role: 'user',
            content: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setStatus(ChatStatus.LOADING);
        setAvatarState(prev => ({ ...prev, isThinking: true }));

        try {
            // API Call
            const responseText = await sendMessageToGemini(text);

            const botMessage: Message = {
                role: 'model',
                content: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setStatus(ChatStatus.IDLE);

            speakWithWebSpeech(
                responseText,
                { languageCode: 'en-US', ssmlGender: 'FEMALE' },
                () => setAvatarState(prev => ({ ...prev, isThinking: false, isTalking: true })),
                () => setAvatarState(prev => ({ ...prev, isTalking: false, isThinking: false }))
            );

        } catch (error) {
            console.error("Chat error:", error);
            setStatus(ChatStatus.ERROR);
            setAvatarState(prev => ({ ...prev, isThinking: false, isTalking: false }));

            const errorMessage: Message = {
                role: 'model',
                content: "I'm having trouble connecting right now. Can we try again?",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    }, []);

    return (
        <Layout>
            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Experience avatarState={avatarState} />
            </div>

            {/* UI Overlay */}
            <ChatInterface
                messages={messages}
                status={status}
                onSendMessage={handleSendMessage}
                title="Sign Language Mode"
                subtitle="Sign to interact with BridgeTalk"
            />

            {/* Sign Language Camera - Left Side */}
            <SignLanguageCamera
                onSignDetected={(text) => {
                    handleSignDetected(text);
                    playSignAudio(text);
                }}
                onProcessingChange={handleSignProcessing}
            />

            {/* Sign Language Response - Right Side */}
            <SignLanguageResponse detectedText={detectedSignText} />
        </Layout>
    );
};

export default SignToTextPage;

