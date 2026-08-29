import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  User,
  RotateCcw,
  HelpCircle,
  Satellite,
  ShieldCheck,
  CheckCircle,
  Copy,
  ChevronRight,
} from 'lucide-react';
import { assistantService } from '../../services/assistantService';
import { Badge } from '../common/Badge';

export function AssistantChat({ className = '' }) {
  const suggestedPrompts = assistantService.getSuggestedQuestions();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **AeroLens AI**, your scientific air quality and satellite intelligence copilot for India.

I can explain **HCHO anomaly detections**, break down **24-hour AQI forecasts**, analyze **atmospheric dispersion conditions**, and clarify model attribution.

How can I assist your environmental analysis today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseObj = await assistantService.askQuestion(query);
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseObj.response,
        model: responseObj.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to communicate with the inference engine. Please retry your query.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you analyze satellite air quality data?',
        timestamp: 'Just now',
      },
    ]);
  };

  // Helper to render basic markdown formatting (*bold*, lists, paragraphs)
  const renderFormattedMessage = (text) => {
    const paragraphs = text.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      // Split into lines
      const lines = para.split('\n');
      return (
        <div key={pIdx} className="space-y-1 my-1">
          {lines.map((line, lIdx) => {
            // Check for list item
            const isBullet = line.startsWith('- ') || line.startsWith('* ');
            const cleanLine = isBullet ? line.substring(2) : line;

            // Simple parser for **bold** text
            const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

            return (
              <p
                key={lIdx}
                className={isBullet ? 'pl-4 relative before:content-["•"] before:absolute before:left-1 before:text-cyan-400' : ''}
              >
                {parts.map((part, partIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <strong key={partIdx} className="font-bold text-slate-100">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  if (part.startsWith('*') && part.endsWith('*')) {
                    return (
                      <em key={partIdx} className="italic text-slate-300">
                        {part.slice(1, -1)}
                      </em>
                    );
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BotMessageSquare className="w-5 h-5 text-cyan-400" />
            <span>Ask AeroLens AI</span>
          </h2>
          <p className="text-xs text-slate-400">
            Scientific environmental intelligence copilot powered by multi-sensor data fusion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" dot>
            Copilot Online
          </Badge>
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg bg-aerodark-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="rounded-2xl border border-slate-800 bg-aerodark-850 shadow-2xl flex flex-col h-[600px] overflow-hidden backdrop-blur-md">
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-cyan-600 to-sky-500 text-white'
                    : 'bg-aerodark-900 border border-cyan-500/30 text-cyan-400'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <BotMessageSquare className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-aerodark-900 border border-slate-800 text-slate-300 rounded-tl-none'
                }`}
              >
                {renderFormattedMessage(msg.text)}

                <div className="mt-2 pt-1 border-t border-slate-700/40 flex items-center justify-between text-[10px] opacity-75 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.model && <span>{msg.model}</span>}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-aerodark-900 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <BotMessageSquare className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-aerodark-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-cyan-400/90 ml-1 font-mono">Analyzing atmospheric vectors...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-5 py-2.5 bg-aerodark-900/90 border-t border-slate-800 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Suggested:</span>
          </span>
          {suggestedPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-aerodark-800 hover:bg-slate-700/80 border border-slate-700 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1"
            >
              <span>{q}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-aerodark-900 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Ask anything about India air quality, HCHO anomalies, or forecast trajectories..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-aerodark-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
