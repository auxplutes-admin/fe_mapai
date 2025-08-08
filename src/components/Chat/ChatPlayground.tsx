import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { sendChatMessage, chatBySessionId } from '@/api';
import { v4 as uuidv4 } from 'uuid';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatPlaygroundProps {
  regionId?: string;
  sessionId?: string;
}

const ChatPlayground: React.FC<ChatPlaygroundProps> = ({ regionId , sessionId }) => {

  console.log('regionId', regionId);
  console.log('sessionId', sessionId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch chat history when component mounts or session changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!sessionId) {
        console.log('No session ID available for chat history');
        return;
      }

      try {
        console.log('Fetching chat history for session:', sessionId);
        const history = await chatBySessionId({ session_id: sessionId });
        
        if (history && Array.isArray(history)) {
          // Create messages for both prompts and responses
          const formattedMessages: Message[] = [];
          
          history.forEach(msg => {
            // Add user message (prompt)
            if (msg.prompt) {
              formattedMessages.push({
                id: `${msg.id}-prompt`,
                text: msg.prompt,
                sender: 'user',
                timestamp: new Date(msg.created_at)
              });
            }
            
            // Add AI message (response)
            if (msg.response) {
              formattedMessages.push({
                id: `${msg.id}-response`,
                text: msg.response.replace(/\*\*/g, ''), // Remove markdown formatting
                sender: 'ai',
                timestamp: new Date(msg.created_at)
              });
            }
          });
          
          // Sort messages by timestamp
          formattedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          
          setMessages(formattedMessages);
          console.log('Loaded chat history:', formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [sessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    // Ensure we have a session ID
    if (!sessionId) {
      console.error('No session ID available');
      return;
    }

    const userMessage: Message = {
      id: uuidv4(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!regionId) {
        throw new Error('No region selected');
      }

      console.log('Sending chat message:', {
        regionId,
        sessionId,
        question: textToSend
      });

      const response = await sendChatMessage({
        regionId,
        question: textToSend,
        session_id: sessionId
      });

      console.log('Received API response:', response);

      if (!response || !response.answer) {
        throw new Error('Invalid API response');
      }

      // Convert markdown bullet points and headers to plain text
      const formattedAnswer = response.answer
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/\n\n/g, '\n') // Normalize line breaks
        .split('\n')
        .map((line: string) => {
          if (line.startsWith('- ')) return '• ' + line.substring(2);
          if (line.startsWith('* ')) return '• ' + line.substring(2);
          return line;
        })
        .join('\n');

      const aiMessage: Message = {
        id: uuidv4(),
        text: formattedAnswer,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        text: error instanceof Error ? error.message : "Sorry, there was an error processing your request",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-gradient-to-b from-white to-indigo-50/40">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-6 space-y-6">
            {/* Welcome Message */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-7 h-7 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                How can I help you?
              </h4>
              <p className="text-gray-600 text-sm mb-6">
                Ask me anything about this location
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex items-start gap-3 max-w-[85%]">
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-4 shadow ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white ml-auto'
                        : 'bg-gradient-to-br from-indigo-50 to-blue-50 text-gray-800 border border-indigo-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-indigo-600/60'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-sm font-medium">U</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 border border-indigo-100">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-white/70">
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative rounded-xl border border-indigo-200 bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-indigo-400/30 focus-within:border-indigo-300">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="resize-none pr-12 pl-4 py-3 min-h-[48px] max-h-32 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={4}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2 h-9 w-9 p-0 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPlayground;