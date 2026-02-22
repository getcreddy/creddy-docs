'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { X, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const transport = new DefaultChatTransport({
  api: '/api/chat',
});

const PANEL_WIDTH = 680;

// Combined component with button + panel - ALL INLINE STYLES (no Tailwind on docs pages)
export function DocsChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status } = useChat({
    transport,
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Push content when panel opens and hide TOC
  useEffect(() => {
    if (isOpen) {
      document.body.style.marginRight = `${PANEL_WIDTH}px`;
      document.body.style.transition = 'margin-right 0.2s ease';
      document.body.setAttribute('data-ai-panel-open', 'true');
    } else {
      document.body.style.marginRight = '0px';
      document.body.removeAttribute('data-ai-panel-open');
    }
    return () => {
      document.body.style.marginRight = '0px';
      document.body.removeAttribute('data-ai-panel-open');
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    await sendMessage({ text: message });
  };

  const handleQuickQuestion = async (question: string) => {
    if (isLoading) return;
    await sendMessage({ text: question });
  };

  return (
    <>
      {/* Ask AI Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '14px',
          right: isOpen ? `${PANEL_WIDTH + 20}px` : '360px',
          zIndex: 99999,
          pointerEvents: 'auto',
          isolation: 'isolate',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          backgroundColor: isOpen ? '#ecfeff' : 'white',
          padding: '6px 16px',
          fontSize: '14px',
          fontWeight: 500,
          color: isOpen ? '#0891b2' : '#374151',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#ecfeff';
            e.currentTarget.style.borderColor = '#22d3ee';
            e.currentTarget.style.color = '#0891b2';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.color = '#374151';
          }
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Sparkles style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
        <span>Ask AI</span>
      </button>

      {/* Sidebar Panel */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 9999,
            display: 'flex',
            height: '100vh',
            flexDirection: 'column',
            borderLeft: '1px solid #e5e7eb',
            backgroundColor: 'white',
            width: `${PANEL_WIDTH}px`,
            paddingTop: '64px',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb',
            padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ width: '20px', height: '20px', color: '#06b6d4' }} />
              <span style={{ fontWeight: 500, color: '#111827' }}>Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                borderRadius: '6px',
                padding: '6px',
                color: '#6b7280',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          <p style={{
            borderBottom: '1px solid #e5e7eb',
            padding: '8px 16px',
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
          }}>
            Responses are generated using AI and may contain mistakes.
          </p>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.length === 0 ? (
              <div style={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#6b7280',
              }}>
                <Sparkles style={{ marginBottom: '12px', width: '32px', height: '32px', color: '#d1d5db' }} />
                <p style={{ marginBottom: '4px', fontWeight: 500, color: '#374151' }}>How can I help?</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Ask me anything about Creddy</p>
                <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                  {['How do I get started?', 'What are scopes?', 'How does enrollment work?'].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickQuestion(q)}
                      disabled={isLoading}
                      style={{
                        borderRadius: '9999px',
                        border: '1px solid #e5e7eb',
                        padding: '6px 12px',
                        fontSize: '12px',
                        color: '#4b5563',
                        cursor: isLoading ? 'default' : 'pointer',
                        backgroundColor: 'white',
                        transition: 'background-color 0.15s',
                        opacity: isLoading ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '90%',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        backgroundColor: message.role === 'user' ? '#06b6d4' : '#f3f4f6',
                        color: message.role === 'user' ? 'white' : '#111827',
                      }}
                    >
                      {message.parts?.map((part, i) => {
                        if (part.type === 'text') {
                          if (message.role === 'assistant') {
                            return (
                              <div key={i} style={{ lineHeight: 1.6 }}>
                                <ReactMarkdown
                                  components={{
                                    p: ({ children }) => <p style={{ margin: '0 0 8px 0' }}>{children}</p>,
                                    code: ({ children, className }) => {
                                      const isBlock = className?.includes('language-');
                                      return isBlock ? (
                                        <pre style={{ 
                                          backgroundColor: '#1f2937', 
                                          color: '#e5e7eb',
                                          padding: '12px', 
                                          borderRadius: '6px', 
                                          overflow: 'auto',
                                          fontSize: '13px',
                                          margin: '8px 0',
                                        }}>
                                          <code>{children}</code>
                                        </pre>
                                      ) : (
                                        <code style={{ 
                                          backgroundColor: '#e5e7eb', 
                                          padding: '2px 6px', 
                                          borderRadius: '4px',
                                          fontSize: '13px',
                                        }}>{children}</code>
                                      );
                                    },
                                    ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>,
                                    ol: ({ children }) => <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ol>,
                                    li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                                    strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
                                    a: ({ href, children }) => (
                                      <a href={href} style={{ color: '#0891b2', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                                        {children}
                                      </a>
                                    ),
                                    h1: ({ children }) => <h1 style={{ fontSize: '18px', fontWeight: 600, margin: '12px 0 8px' }}>{children}</h1>,
                                    h2: ({ children }) => <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '12px 0 8px' }}>{children}</h2>,
                                    h3: ({ children }) => <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '10px 0 6px' }}>{children}</h3>,
                                    table: ({ children }) => (
                                      <div style={{ overflowX: 'auto', margin: '12px 0' }}>
                                        <table style={{ 
                                          width: '100%', 
                                          borderCollapse: 'collapse', 
                                          fontSize: '13px',
                                          border: '1px solid #e5e7eb',
                                          borderRadius: '6px',
                                        }}>{children}</table>
                                      </div>
                                    ),
                                    thead: ({ children }) => <thead style={{ backgroundColor: '#f9fafb' }}>{children}</thead>,
                                    tbody: ({ children }) => <tbody>{children}</tbody>,
                                    tr: ({ children }) => <tr style={{ borderBottom: '1px solid #e5e7eb' }}>{children}</tr>,
                                    th: ({ children }) => (
                                      <th style={{ 
                                        padding: '8px 12px', 
                                        textAlign: 'left', 
                                        fontWeight: 600,
                                        borderBottom: '2px solid #e5e7eb',
                                        whiteSpace: 'nowrap',
                                      }}>{children}</th>
                                    ),
                                    td: ({ children }) => (
                                      <td style={{ 
                                        padding: '8px 12px', 
                                        borderBottom: '1px solid #e5e7eb',
                                      }}>{children}</td>
                                    ),
                                  }}
                                >
                                  {part.text}
                                </ReactMarkdown>
                              </div>
                            );
                          }
                          return part.text.split('\n').map((line, j) => (
                            <p key={`${i}-${j}`} style={{ margin: '0 0 4px 0' }}>
                              {line || '\u00A0'}
                            </p>
                          ));
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#f3f4f6',
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: '#6b7280',
                    }}>
                      <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid #e5e7eb', padding: '16px' }}>
            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  padding: '10px 48px 10px 16px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#06b6d4'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: '6px',
                  padding: '6px',
                  color: input.trim() ? '#06b6d4' : '#9ca3af',
                  cursor: input.trim() ? 'pointer' : 'default',
                  border: 'none',
                  backgroundColor: 'transparent',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Spinner keyframe animation + hide TOC when panel open */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Hide Nextra's "On this page" TOC when AI panel is open */
        body[data-ai-panel-open="true"] .nextra-toc,
        body[data-ai-panel-open="true"] aside.nextra-scrollbar:last-of-type,
        body[data-ai-panel-open="true"] [class*="toc"],
        body[data-ai-panel-open="true"] nav[aria-label="table of contents"] {
          display: none !important;
        }
      `}</style>
    </>
  );
}

// Legacy floating button for landing page (uses Tailwind - only loaded there)
export function DocsChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status } = useChat({
    transport,
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    await sendMessage({ text: message });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-cyan-600 hover:shadow-xl ${isOpen ? 'hidden' : ''}`}
      >
        <Sparkles className="size-5" />
        <span className="font-medium">Ask AI</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-cyan-500" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Ask about Creddy</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                <Sparkles className="mb-3 size-8" />
                <p className="mb-1 font-medium">How can I help?</p>
                <p className="text-sm">Ask me anything about Creddy</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      }`}
                    >
                      {message.parts?.map((part, i) => {
                        if (part.type === 'text') {
                          return part.text.split('\n').map((line, j) => (
                            <p key={`${i}-${j}`} className="mb-1 last:mb-0">
                              {line || '\u00A0'}
                            </p>
                          ));
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:bg-gray-800">
                      <Loader2 className="size-4 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-cyan-500 px-3 py-2 text-white transition-colors hover:bg-cyan-600 disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
