
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Mic, Image, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  images?: string[];
  audio?: string;
}

const AiChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Hey! All your favorite books are within reach!", 
      isUser: false,
      timestamp: formatTime(new Date(Date.now() - 60000 * 5))
    },
    { 
      id: 2, 
      text: "You can check all books, come to my home. We will discuss about project", 
      isUser: false,
      timestamp: formatTime(new Date(Date.now() - 60000 * 4)),
      images: [
        "/lovable-uploads/dfe28b60-1173-4b2f-bd09-26817bd1241a.png"
      ]
    },
    {
      id: 3,
      text: "That's great! I will come tomorrow evening.",
      isUser: true,
      timestamp: formatTime(new Date(Date.now() - 60000 * 3))
    },
    {
      id: 4,
      isUser: true,
      text: "",
      timestamp: formatTime(new Date(Date.now() - 60000 * 2)),
      audio: "0:22"
    },
    {
      id: 5,
      text: "Okay, See yeah!",
      isUser: false,
      timestamp: formatTime(new Date(Date.now() - 60000 * 1))
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  function formatTime(date = new Date()) {
    return `${date.getHours() % 12 || 12}:${String(date.getMinutes()).padStart(2, '0')} ${date.getHours() >= 12 ? 'pm' : 'am'}`;
  }
  
  const sendMessage = () => {
    if (message.trim()) {
      // Add user message
      const newMessages = [
        ...messages, 
        { 
          id: Date.now(), 
          text: message, 
          isUser: true,
          timestamp: formatTime()
        }
      ];
      setMessages(newMessages);
      setMessage('');
      
      // Show typing indicator
      setIsTyping(true);
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            text: "I'm looking forward to our meeting tomorrow! Feel free to bring any questions you have about the project.", 
            isUser: false,
            timestamp: formatTime()
          }
        ]);
      }, 2000);
    }
  };
  
  const renderAudioMessage = (audio: string) => (
    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2 mt-2">
      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
        <Mic size={16} className="text-white" />
      </div>
      <div className="mx-2 flex-1">
        <div className="flex-1 w-full h-8 flex items-center">
          <svg viewBox="0 0 200 40" className="w-full">
            <path 
              d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20 T120,20 T140,20 T160,20 T180,20 T200,20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-icon-purple"
            />
          </svg>
        </div>
      </div>
      <div className="text-xs font-medium">{audio}</div>
    </div>
  );

  const renderImageGallery = (images: string[]) => (
    <div className="flex gap-2 mt-2 flex-wrap">
      {images.map((img, index) => (
        <div key={index} className="w-24 h-24 rounded-lg overflow-hidden">
          <img src={img} alt="Shared content" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="page-container bg-white dark:bg-gray-900 p-0">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 shadow-sm p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
            </Link>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border-2 border-[#BEB1CB]">
                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Fadaye" />
                <AvatarFallback>FT</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h1 className="text-base font-semibold">Fadaye Touse</h1>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#BEB1CB] mr-1.5"></div>
                  <span className="text-xs text-[#BEB1CB] font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
                <path d="M15.6 11.6L22 7v10l-6.4-4.5v-1"></path>
                <path d="M4 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2z"></path>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col pt-20 pb-20 px-4">        
        <div className="space-y-4">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {!msg.isUser && (
                <div className="mr-2 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Fadaye" />
                    <AvatarFallback>FT</AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              <div className={`max-w-[75%] ${msg.isUser ? 'order-1' : 'order-2'}`}>
                <div 
                  className={`rounded-2xl py-2 px-3 ${
                    msg.isUser 
                      ? 'bg-[#BEB1CB] text-gray-800 rounded-br-none' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text && <div className="text-sm">{msg.text}</div>}
                  
                  {msg.images && renderImageGallery(msg.images)}
                  
                  {msg.audio && renderAudioMessage(msg.audio)}
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="mr-2 mt-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Fadaye" />
                  <AvatarFallback>FT</AvatarFallback>
                </Avatar>
              </div>
              
              <div>
                <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none py-2 px-4">
                  <div className="flex space-x-1 items-center h-5">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Typing...
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container max-w-4xl mx-auto p-3">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
            <div className="flex items-center">
              <Button size="icon" variant="ghost" className="rounded-full text-gray-500 hover:bg-transparent hover:text-gray-700 dark:hover:text-gray-300">
                <Paperclip size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full text-gray-500 hover:bg-transparent hover:text-gray-700 dark:hover:text-gray-300">
                <Image size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full text-gray-500 hover:bg-transparent hover:text-gray-700 dark:hover:text-gray-300">
                <Mic size={20} />
              </Button>
            </div>
            
            <Input 
              type="text"
              className="flex-1 px-4 py-2 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            
            <Button size="icon" variant="ghost" className="rounded-full text-gray-500 hover:bg-transparent hover:text-gray-700 dark:hover:text-gray-300">
              <Smile size={20} />
            </Button>
            
            <Button 
              size="icon"
              className={`rounded-full ${
                message.trim() 
                  ? 'bg-[#BEB1CB] hover:bg-[#BEB1CB]/90 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              onClick={sendMessage}
              disabled={!message.trim()}
            >
              <Send size={20} />
            </Button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs text-[#BEB1CB] font-medium">AI Assistant Chat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
