'use client';

import { useState, useEffect, useRef } from 'react';
import { Column, Button, Input } from '@once-ui-system/core';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface StoredMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp?: string;
}

interface ChatModalProps {
  onClose: () => void;
}

const CHAT_STORAGE_KEY = 'portfolio_chat_messages';

export default function ChatModal({ onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const storedMessages = sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages).map((msg: StoredMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp || Date.now())
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing stored messages:', error);
        setMessages([]);
      }
    } else {
      // Add a default welcome message if no stored messages
      const welcomeMessage: Message = {
        id: 'welcome',
        text: 'Bienvenido al apartado de Chat,en que puedo ayudarte?',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Only auto-scroll if user is already near bottom
      const messagesContainer = document.getElementById('chat-messages');
      if (messagesContainer) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

        if (isNearBottom) {
          scrollToBottom();
        }
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from agent');
      }

      const data = await response.json();
      console.log('Full response from API:', data); // Log for debugging

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.output || data.message || data.text || data.result || 'Sorry, I could not understand that.',
        sender: 'agent',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Error: Could not connect to the AI agent.',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <Column
        maxWidth="m"
        background="surface"
        border="neutral-medium"
        radius="l"
        padding="l"
        className="chat-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chat-header">
          <Button variant="tertiary" size="s" onClick={onClose} className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left">
              <title>Back</title>
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M15 6l-6 6l6 6" />
            </svg>
          </Button>
          <div className="chat-title-center">
            <div className="header-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-message-chatbot">
                <title>Chatbot Header Icon</title>
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M18 3a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-4.724l-4.762 2.857a1 1 0 0 1 -1.508 -.743l-.006 -.114v-2h-1a4 4 0 0 1 -3.995 -3.8l-.005 -.2v-8a4 4 0 0 1 4 -4zm-2.8 9.286a1 1 0 0 0 -1.414 .014a2.5 2.5 0 0 1 -3.572 0a1 1 0 0 0 -1.428 1.4a4.5 4.5 0 0 0 6.428 0a1 1 0 0 0 -.014 -1.414m-5.69 -4.286h-.01a1 1 0 1 0 0 2h.01a1 1 0 0 0 0 -2m5 0h-.01a1 1 0 0 0 0 2h.01a1 1 0 0 0 0 -2"/>
              </svg>
            </div>
            <h3>Portfol-IA</h3>
            <span className="online-status">{isTyping ? 'escribiendo...' : ''}</span>
          </div>
          {/* Espacio para mantener centrado */}
          <div className="header-spacer" />
        </div>
        <div className="chat-separator"></div>
        <div className="chat-messages" id="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-container ${msg.sender}`}>
              <div className={`message ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'user' ? (
                    <div className="avatar user-avatar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-user">
                        <title>User Avatar</title>
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                        <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="avatar agent-avatar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-message-chatbot">
                        <title>Chatbot Avatar</title>
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M18 3a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-4.724l-4.762 2.857a1 1 0 0 1 -1.508 -.743l-.006 -.114v-2h-1a4 4 0 0 1 -3.995 -3.8l-.005 -.2v-8a4 4 0 0 1 4 -4zm-2.8 9.286a1 1 0 0 0 -1.414 .014a2.5 2.5 0 0 1 -3.572 0a1 1 0 0 0 -1.428 1.4a4.5 4.5 0 0 0 6.428 0a1 1 0 0 0 -.014 -1.414m-5.69 -4.286h-.01a1 1 0 1 0 0 2h.01a1 1 0 0 0 0 -2m5 0h-.01a1 1 0 0 0 0 2h.01a1 1 0 0 0 0 -2"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                  </div>
                  <div className="message-time">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-container agent">
              <div className="message agent typing">
                <div className="message-avatar">
                  <div className="avatar agent-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-message-chatbot">
                      <title>Chatbot Avatar</title>
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M18 3a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-4.724l-4.762 2.857a1 1 0 0 1 -1.508 -.743l-.006 -.114v-2h-1a4 4 0 0 1 -3.995 -3.8l-.005 -.2v-8a4 4 0 0 1 4 -4zm-2.8 9.286a1 1 0 0 0 -1.414 .014a2.5 2.5 0 0 1 -3.572 0a1 1 0 0 0 -1.428 1.4a4.5 4.5 0 0 0 6.428 0a1 1 0 0 0 -.014 -1.414m-5.69 -4.286h-.01a1 1 0 1 0 0 2h.01a1 1 0 0 0 0 -2m5 0h-.01a1 1 0 0 0 0 2h.01a1 1 0 0 0 0 -2"/>
                    </svg>
                  </div>
                </div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-area">
          <Input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={isLoading} variant="primary">
            {isLoading ? 'Enviando...' : 'Enviar'}

          </Button>
        </div>
      </Column>
      <style jsx>{`
        .chat-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          z-index: 1001;
          padding: 20px;
        }
        .chat-modal {
          height: 450px;
          width: 320px;
          max-height: 80vh;
          max-width: 90vw;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
          position: fixed;
          bottom: 20px;
          right: 20px;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-neutral-medium);
          background-color: var(--color-surface);
          position: relative;
          min-height: 44px;
        }
        .chat-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--color-neutral-medium) 20%, var(--color-neutral-medium) 80%, transparent 100%);
        }
        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-title-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .header-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #25d366;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .header-avatar svg {
          width: 32px;
          height: 32px;
        }
        .header-spacer {
          width: 40px;
          height: 40px;
        }
        .back-button {
          font-size: 20px;
          min-width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .user-avatar {
          background-color: #007bff;
        }
        .agent-avatar {
          background-color: #25d366;
        }
        .chat-title h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        .online-status {
          font-size: 12px;
          color:rgb(158, 158, 158);
          font-weight: 500;
        }
        .chat-separator {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--color-neutral-medium) 20%, var(--color-neutral-medium) 80%, transparent 100%);
          flex-shrink: 0;
        }
        .chat-messages {
          flex: 1 1 auto;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 16px;
          background-color: transparent;
          scroll-behavior: smooth;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-messages::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
        .message-container {
          display: flex;
          margin-bottom: 8px;
        }
        .message-container.user {
          justify-content: flex-end;
        }
        .message-container.agent {
          justify-content: flex-start;
        }
        .message {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 85%;
        }
        .message.user {
          flex-direction: row-reverse;
        }
        .message-avatar {
          flex-shrink: 0;
        }
        .message-content {
          flex: 1;
        }
        .message-bubble {
          background-color: rgba(255, 255, 255, 0.9);
          padding: 8px 12px;
          border-radius: 18px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          word-wrap: break-word;
          position: relative;
          color: #333;
          font-weight: 400;
          backdrop-filter: blur(8px);
        }
        .message-container.user .message-bubble {
          background-color: rgba(0, 123, 255, 0.9);
          color: white;
          border-bottom-right-radius: 4px;
          font-weight: 400;
          backdrop-filter: blur(8px);
        }
        .message-container.agent .message-bubble {
          background-color: rgba(155, 155, 155, 0.9);
          color: #333;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(155, 155, 155, 0.9);
          backdrop-filter: blur(8px);
        }
        .message-bubble p {
          margin: 0;
          font-size: 14px;
          line-height: 1.4;
        }
        .message-bubble.typing {
          padding: 12px;
        }
        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #999;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        .message-time {
          font-size: 11px;
          color: #999;
          margin-top: 4px;
          text-align: right;
        }
        .message-container.user .message-time {
          text-align: left;
        }
        .chat-input-area {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          background-color: var(--color-surface);
          border-top: 1px solid var(--color-neutral-medium);
          flex-shrink: 0;
          min-height: 60px;
        }
        .chat-input-area input {
          flex: 1;
          font-size: 14px;
          border-radius: 20px;
          border: 1px solid var(--color-neutral-medium);
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .chat-modal-overlay {
            align-items: flex-end;
            justify-content: center;
            padding: 10px;
          }
          .chat-modal {
            width: 100%;
            height: 100vh;
            max-height: 100vh;
            max-width: 100vw;
            margin-bottom: 0;
            bottom: 0;
            right: 0;
            left: 0;
            position: fixed;
          }
          .chat-header {
            padding: 20px;
            min-height: 60px;
          }
          .chat-messages {
            padding: 16px;
            flex: 1 1 auto;
          }
          .chat-input-area {
            min-height: 70px;
            padding: 16px;
          }
          .avatar {
            width: 45px;
            height: 45px;
            font-size: 20px;
          }
          .message-bubble p {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
