import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatIcon, GeminiIcon, BookOpenText } from './icons/index';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface GeminiChatWidgetProps {
    initialPrompt?: { fullPrompt: string; userText: string; } | null;
    onPromptHandled?: () => void;
    isActivityOpen: boolean;
    onOpenChatBook: () => void;
    isVisible?: boolean;
}

const GeminiChatWidget: React.FC<GeminiChatWidgetProps> = ({ initialPrompt, onPromptHandled, isActivityOpen, onOpenChatBook, isVisible = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chat) {
            try {
                // FIX: Removed non-null assertion from API_KEY.
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const newChat = ai.chats.create({
                    model: 'gemini-3-flash-preview',
                    config: {
                        systemInstruction: `You are the "devLush" Visual Learning Assistant. 
                        This app is a highly visual and interactive platform for devLush agents.
                        
                        Your goal is to:
                        1. Provide brief, summarized information in your first response.
                        2. Use Markdown for formatting (bold, italics, lists).
                        3. Use Tables whenever comparing data or listing clinical vitals.
                        4. Focus on visual analogies and explaining complex biological/medical processes.
                        5. Keep explanations concise and educational.
                        
                        When explaining a topic for the first time, always provide a "Quick Summary" section at the top.`,
                    },
                });
                setChat(newChat);
                setHistory([]);
                setInput('');
            } catch (error) {
                console.error("Failed to initialize Gemini Chat:", error);
                setHistory([{ role: 'model', text: 'Error: Could not connect to the AI assistant. Please check the API key.' }]);
            }
        }
    }, [isOpen, chat]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const sendMessage = useCallback(async (message: string, userText?: string) => {
        if (!message.trim() || !chat || isLoading) return;

        const userMessage: Message = { role: 'user', text: userText || message };
        setHistory(prev => [...prev, userMessage, { role: 'model', text: '' }]);
        if (!userText) setInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message });

            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    const lastMessage = newHistory[newHistory.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.text += chunkText;
                    }
                    return newHistory;
                });
            }

        } catch (error) {
            console.error("Gemini API Error:", error);
            setHistory(prev => {
                const newHistory = [...prev];
                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage.role === 'model') {
                    lastMessage.text = 'Sorry, I encountered an error. Please try again.';
                }
                return newHistory;
            });
        } finally {
            setIsLoading(false);
        }
    }, [chat, isLoading]);

    useEffect(() => {
        if (initialPrompt) {
            setIsOpen(true);
            // Ensure chat is initialized before sending message
            if (chat) {
                sendMessage(initialPrompt.fullPrompt, initialPrompt.userText);
                onPromptHandled?.();
            }
        }
    }, [initialPrompt, chat, sendMessage, onPromptHandled]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    if (!isVisible) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2"
                aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
                aria-expanded={isOpen}
                aria-controls="agent-ai-chat"
            >
                <ChatIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div id="agent-ai-chat" role="region" aria-label="AI chat" className="fixed inset-x-4 bottom-24 z-50 flex h-[min(60vh,36rem)] max-h-[calc(100dvh-8rem)] w-auto max-w-sm flex-col rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl transition-all gemini-chat-widget sm:inset-x-auto sm:right-6 sm:w-[calc(100vw-3rem)]">
                    <header className="flex items-center justify-between p-4 border-b border-border bg-cyan-600 text-white rounded-t-2xl">
                        <div className="flex items-center gap-2">
                            <GeminiIcon className="w-6 h-6" />
                            <h3 className="font-bold">MedCush Assistant</h3>
                        </div>
                        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close AI chat" className="flex h-11 w-11 items-center justify-center rounded-full text-2xl text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">&times;</button>
                    </header>
                    <header className="flex items-center justify-between p-2 border-b border-border">
                        <button
                            type="button"
                            onClick={onOpenChatBook}
                            disabled={!isActivityOpen}
                            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!isActivityOpen ? "Open a lab or activity to use the assistant" : "Open AI Activity Assistant"}
                        >
                            <BookOpenText className="w-4 h-4" />
                            <span>AI Activity Assistant</span>
                        </button>
                    </header>
                    <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                        {history.map((msg, index) => (
                            <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <GeminiIcon className="w-6 h-6 flex-shrink-0" />}
                                <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'}`}>
                                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:p-2 prose-table:border prose-table:border-border prose-td:border prose-td:border-border prose-td:p-1 prose-th:bg-muted">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                    {isLoading && msg.role === 'model' && index === history.length - 1 && <div className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse ml-1 inline-block"></div>}
                                </div>
                            </div>
                        ))}
                        {history.length === 0 && (
                            <div className="text-center text-muted-foreground p-4">
                                <p>Ask me anything about biology, or select text on the page to get an explanation!</p>
                                <p className="text-xs mt-2">e.g., "Explain cellular respiration like I'm 10."</p>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleFormSubmit} className="p-4 border-t border-border">
                        <div className="relative">
                            <input
                                type="text"
                                aria-label="Ask the AI assistant"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="w-full p-3 pr-12 rounded-full bg-muted border border-border"
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message" className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cyan-600 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:bg-muted-foreground">
                                &#10148;
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default GeminiChatWidget;
