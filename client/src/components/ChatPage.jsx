import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';





const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const styles = {
    chatContainer: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      right: '20px',
      bottom: '20px',
      background: '#F5F5F5', // Light gray background
      borderRadius: '0', // Sharp, brutalist edges
      border: '4px solid #000000', // Black border
      boxShadow: '8px 8px 0 #000000', // Pronounced block shadow
      color: '#000000', // Black text
      fontFamily: 'neue-haas-grotesk, Arial, sans-serif', // Neo-brutalist typography
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      flexDirection: 'column',
    },
    chatHeader: {
      padding: '20px',
      borderBottom: '4px solid #000000', // Thick black divider
      backgroundColor: '#FFC135', // Bright yellow
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: '3px solid #000000',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#000000',
      cursor: 'pointer',
      padding: '0 10px',
      transition: 'all 0.2s', // Sharp interaction
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      background: '#F5F5F5', // Light background
      border: '2px solid #000000', // Black border
      display: 'flex',
      flexDirection: 'column',
    },
    form: {
      display: 'flex',
      gap: '10px',
      padding: '20px',
      borderTop: '4px solid #000000',
      backgroundColor: '#FFC135', // Bright yellow
    },
    input: {
      flex: 1,
      padding: '15px',
      border: '4px solid #000000', // Black border
      borderRadius: '0',
      fontSize: '16px',
      color: '#000000',
      background: '#F5F5F5',
      fontFamily: 'neue-haas-grotesk, monospace',
    },
    sendButton: {
      padding: '15px 30px',
      backgroundColor: '#000000', // Black background
      color: '#FFFF00', // Yellow text
      border: '4px solidrgb(247, 193, 76)', // Yellow border
      borderRadius: '0',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '4px 4px 0rgb(244, 199, 104)', // Yellow block shadow
      transition: 'all 0.3s', // Sharp transition
    },
    userMessage: {
      backgroundColor: '#FFC135', // Bright yellow background
      color: '#000000', // Black text
      alignSelf: 'flex-end',
      margin: '10px 0',
      padding: '15px',
      borderRadius: '0',
      border: '3px solid #000000',
      maxWidth: '80%',
      fontFamily: 'neue-haas-grotesk, monospace',
    },
    botMessage: {
      backgroundColor: '#FFC135', // Light background
      color: '#000000', // Black text
      alignSelf: 'flex-start',
      margin: '10px 0',
      padding: '15px',
      borderRadius: '0',
      border: '3px solid #000000',
      maxWidth: '80%',
      fontFamily: 'neue-haas-grotesk, monospace',
    },
    loadingMessage: {
      alignSelf: 'flex-start',
      margin: '10px 0',
      padding: '15px',
      backgroundColor: '#FFFF00',
      color: '#000000',
      border: '3px solid #000000',
      maxWidth: '80%',
    }
  };

  // Add initial welcome message on component mount
  useEffect(() => {
    const welcomeMessage = {
      text: "Welcome to Skillverse support! I can help with questions about Skillverse site or our courses on medicinal plants, human anatomy, and the solar system.",
      sender: 'bot'
    };
    setMessages([welcomeMessage]);
  }, []);

  
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

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Skillverse support</span>
        <button 
          onClick={() => navigate(-1)} 
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
              boxShadow: '3px 3px 0 rgba(0,0,0,0.5)' // Black shadow
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
  );
};

export default ChatPage;