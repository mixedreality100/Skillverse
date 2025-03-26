import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Bot as BotIcon } from "lucide-react"; // Import the Bot icon from lucide-react

const Bot = () => {
  // State to control pop-up visibility
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Chat-related states
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State to track window width for responsiveness
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add initial welcome message when the chat opens
  useEffect(() => {
    if (isChatOpen) {
      const welcomeMessage = {
        text: "Welcome to Skillverse support! I can help with questions about Skillverse site or our courses on medicinal plants, human anatomy, and the solar system.",
        sender: 'bot'
      };
      setMessages([welcomeMessage]);
    }
  }, [isChatOpen]);

  // Handle sending messages to the Gemini API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const newUserMessage = { 
      text: input, 
      sender: 'user' 
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Clear input
    setInput("");
    
    // Set loading state
    setIsLoading(true);

    try {
      // Make API call to Gemini
      const response = await axios.post('http://localhost:3001/api/gemini', {
        message: input,
        context: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      });

      // Add bot response
      const botMessage = { 
        text: response.data.response, 
        sender: 'bot' 
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("API call failed:", error);
      
      // Add error message
      const errorMessage = { 
        text: "Sorry, something went wrong. Please try again.", 
        sender: 'bot' 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      // Remove loading state
      setIsLoading(false);
    }
  };

  // Determine if the device is mobile (width < 600px)
  const isMobile = windowWidth < 600;

  // Styles (adjusted for mobile responsiveness)
  const styles = {
    button: {
      backgroundColor: '#ffd700',
      border: 'none',
      borderRadius: '50%',
      width: isMobile ? '48px' : '56px', // Smaller on mobile
      height: isMobile ? '48px' : '56px',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      transition: 'transform 0.2s',
      position: 'fixed',
      bottom: isMobile ? '16px' : '24px', // Closer to the edge on mobile
      right: isMobile ? '16px' : '24px',
      padding: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: isMobile ? '24px' : '28px', // Smaller icon on mobile
      height: isMobile ? '24px' : '28px',
      color: '#222',
    },
    chatContainer: {
      position: 'fixed',
      bottom: isMobile ? '80px' : '100px', // Adjust position for mobile
      right: isMobile ? '5%' : '24px', // Center on mobile with margin
      left: isMobile ? '5%' : 'auto', // Stretch across on mobile
      width: isMobile ? '90%' : '500px', // Full width on mobile, fixed on desktop
      height: isMobile ? '80vh' : '500px', // Taller on mobile, fixed on desktop
      maxHeight: isMobile ? '80vh' : '500px', // Prevent overflow on mobile
      background: '#F5F5F5',
      borderRadius: '0',
      border: '4px solid #000000',
      boxShadow: '8px 8px 0 #000000',
      color: '#000000',
      fontFamily: 'neue-haas-grotesk, Arial, sans-serif',
      fontSize: isMobile ? '14px' : '16px', // Smaller font on mobile
      fontWeight: 'bold',
      display: isChatOpen ? 'flex' : 'none',
      flexDirection: 'column',
      zIndex: 1001,
    },
    chatHeader: {
      padding: isMobile ? '15px' : '20px', // Smaller padding on mobile
      borderBottom: '4px solid #000000',
      backgroundColor: '#FFC135',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: '3px solid #000000',
      fontSize: isMobile ? '18px' : '22px', // Smaller on mobile
      fontWeight: 'bold',
      color: '#000000',
      cursor: 'pointer',
      padding: isMobile ? '0 8px' : '0 10px',
      transition: 'all 0.2s',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: isMobile ? '15px' : '20px', // Smaller padding on mobile
      background: '#F5F5F5',
      border: '2px solid #000000',
      display: 'flex',
      flexDirection: 'column',
    },
    form: {
      display: 'flex',
      gap: isMobile ? '8px' : '10px', // Smaller gap on mobile
      padding: isMobile ? '15px' : '20px', // Smaller padding on mobile
      borderTop: '4px solid #000000',
      backgroundColor: '#FFC135',
    },
    input: {
      flex: 1,
      padding: isMobile ? '10px' : '12px', // Smaller padding on mobile
      border: '4px solid #000000',
      borderRadius: '0',
      fontSize: isMobile ? '14px' : '16px', // Smaller font on mobile
      color: '#000000',
      background: '#F5F5F5',
      fontFamily: 'neue-haas-grotesk, monospace',
    },
    sendButton: {
      padding: isMobile ? '10px 20px' : '12px 24px', // Smaller padding on mobile
      backgroundColor: '#000000',
      color: '#FFFFFF',
      border: '4px solid rgb(247, 193, 76)',
      borderRadius: '0',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px', // Smaller font on mobile
      fontWeight: 'bold',
      boxShadow: '4px 4px 0 rgb(244, 199, 104)',
      transition: 'all 0.3s',
    },
    userMessage: {
      backgroundColor: '#FFC135',
      color: '#000000',
      alignSelf: 'flex-end',
      margin: isMobile ? '8px 0' : '10px 0', // Smaller margin on mobile
      padding: isMobile ? '10px' : '12px', // Smaller padding on mobile
      borderRadius: '0',
      border: '3px solid #000000',
      maxWidth: isMobile ? '80%' : '70%', // Slightly wider on mobile for better fit
      fontFamily: 'neue-haas-grotesk, monospace',
      fontSize: isMobile ? '14px' : '16px', // Smaller font on mobile
    },
    botMessage: {
      backgroundColor: '#FFC135',
      color: '#000000',
      alignSelf: 'flex-start',
      margin: isMobile ? '8px 0' : '10px 0', // Smaller margin on mobile
      padding: isMobile ? '10px' : '12px', // Smaller padding on mobile
      borderRadius: '0',
      border: '3px solid #000000',
      maxWidth: isMobile ? '80%' : '70%', // Slightly wider on mobile for better fit
      fontFamily: 'neue-haas-grotesk, monospace',
      fontSize: isMobile ? '14px' : '16px', // Smaller font on mobile
    },
    loadingMessage: {
      alignSelf: 'flex-start',
      margin: isMobile ? '8px 0' : '10px 0', // Smaller margin on mobile
      padding: isMobile ? '10px' : '12px', // Smaller padding on mobile
      backgroundColor: '#FFFF00',
      color: '#000000',
      border: '3px solid #000000',
      maxWidth: isMobile ? '80%' : '70%', // Slightly wider on mobile for better fit
      fontSize: isMobile ? '14px' : '16px', // Smaller font on mobile
    }
  };

  return (
    <>
      {/* Bot Button */}
      <button
        style={styles.button}
        onClick={() => setIsChatOpen(!isChatOpen)}
        type="button"
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <BotIcon style={styles.icon} />
      </button>

      {/* Pop-Up Chat Window */}
      <div style={styles.chatContainer}>
        <div style={styles.chatHeader}>
          <span style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold' }}>
            Skillverse support
          </span>
          <button 
            onClick={() => setIsChatOpen(false)}
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#000000';
              e.target.style.color = '#FFFF00';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#000000';
            }}
          >
            ✕
          </button>
        </div>
        
        <div style={styles.messagesContainer}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              style={{
                ...styles[msg.sender === 'user' ? 'userMessage' : 'botMessage'],
                boxShadow: '3px 3px 0 rgba(0,0,0,0.5)'
              }}
            >
              {msg.text}
            </div>
          ))}
          
          {isLoading && (
            <div style={styles.loadingMessage}>
              Thinking...
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
            placeholder="Your message here"
          />
          <button 
            type="submit" 
            style={styles.sendButton}
            onMouseDown={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translate(4px, 4px)';
            }}
            onMouseUp={(e) => {
              e.target.style.boxShadow = '4px 4px 0 #FFFF00';
              e.target.style.transform = 'translate(0, 0)';
            }}
          >
            SEND ⇢
          </button>
        </form>
      </div>
    </>
  );
};

export default Bot;