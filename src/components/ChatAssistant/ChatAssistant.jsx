import React, { useState } from 'react';
import axios from 'axios';
import './ChatAssistant.css';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);


  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage = { text: inputMessage, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');

    try {
      const QWEN3_API_KEY = import.meta.env.VITE_QWEN3_API_KEY;
      const QWEN3_API_URL = `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`;

      const response = await axios.post(QWEN3_API_URL, {
        model: "qwen-turbo",
        input: {
          prompt: inputMessage
        },
        parameters: {
          "result_format": "message"
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QWEN3_API_KEY}`,
          'X-DashScope-SSE': 'enable'
        }
      });

      const aiResponseText = response.data.output.text;
      const newAiMessage = { text: aiResponseText, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = { text: '抱歉，AI助手暂时无法回复。', sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="chat-assistant-container">
      <button className="chat-toggle-button" onClick={toggleChat}>
        AI 助手
      </button>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>AI 聊天助手</h3>
            <button onClick={toggleChat}>X</button>
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="输入您的问题..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button onClick={handleSendMessage}>发送</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;