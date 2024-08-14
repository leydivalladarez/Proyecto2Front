import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const source = new EventSource('http://localhost:8080/chat');

    source.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    source.onerror = (err) => {
      console.error('EventSource failed:', err);
      source.close();
    };

    return () => {
      if (source) {
        source.close();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await axios.post(
          'http://localhost:8080/sendMessage',
          new URLSearchParams({ message: newMessage }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        setNewMessage(''); // Limpiar el campo de entrada
      } catch (error) {
        console.error('Error sending message', error);
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="position-fixed bottom-0 end-0 m-3">
      <button
        className={`btn btn-outline-primary rounded-circle ${isOpen ? 'bg-secondary' : ''}`}
        onClick={toggleChat}
        style={{ width: '60px', height: '60px', border: '2px solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <i className={`fas fa-comment-dots ${isOpen ? 'text-white' : 'text-primary'}`} style={{ fontSize: '24px' }}></i>
      </button>
      {isOpen && (
        <div className="card shadow-lg mt-2" style={{ width: '300px', maxHeight: '400px' }}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Soporte en línea</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={toggleChat}></button>
          </div>
          <div className="card-body overflow-auto" style={{ maxHeight: '300px' }}>
            {messages.map((msg, index) => (
              <p key={index} className="mb-1">{msg}</p>
            ))}
          </div>
          <div className="card-footer d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
