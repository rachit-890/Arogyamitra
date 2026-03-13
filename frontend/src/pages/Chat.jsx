import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

const Chat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I am AROMI, your personal fitness coach. Need to adjust your plan because of travel or feeling tired? Let me know!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if(!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/chat-aromi', { message: userMsg });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply || "I'm having trouble connecting to my brain right now." }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto h-[80vh] flex flex-col card p-0 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl">🤖</div>
                <div>
                    <h2 className="text-xl font-bold text-accent">AROMI Coach</h2>
                    <p className="text-xs text-slate-400">Always here to adapt your routine</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'glass rounded-bl-none text-slate-200'}`}>
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="glass rounded-2xl rounded-bl-none p-4 text-slate-400 text-sm italic">
                            AROMI is typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
                    disabled={loading}
                />
                <button type="submit" disabled={loading} className="bg-accent hover:bg-violet-600 px-6 rounded-lg font-medium transition-colors text-white">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
