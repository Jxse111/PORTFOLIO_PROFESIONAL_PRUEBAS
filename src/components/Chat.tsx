'use client';

import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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

      // Assuming n8n returns { response: "Agent's reply" }
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || 'Sorry, I could not understand that.',
        sender: 'agent',
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Error: Could not connect to the AI agent.',
        sender: 'agent',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask the AI agent..."
          disabled={isLoading}
        />
        <button type="button" onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <style jsx>{`
        .chat-container {
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
        }
        .messages {
          height: 400px;
          overflow-y: auto;
          margin-bottom: 16px;
        }
        .message {
          margin-bottom: 8px;
          padding: 8px;
          border-radius: 4px;
        }
        .message.user {
          background-color: #0070f3;
          color: white;
          text-align: right;
        }
        .message.agent {
          background-color: #f0f0f0;
          text-align: left;
        }
        .input-area {
          display: flex;
        }
        .input-area input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px 0 0 4px;
        }
        .input-area button {
          padding: 8px 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
        }
        .input-area button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
