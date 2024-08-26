import React, { useState, useEffect } from 'react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/chat');

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.send(newMessage);
      setNewMessage(''); // Limpiar el campo de entrada
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
