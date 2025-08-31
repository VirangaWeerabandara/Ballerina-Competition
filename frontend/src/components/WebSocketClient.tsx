import React, { useEffect, useState } from 'react';

interface WebSocketClientProps {
  url?: string;
}

const WebSocketClient: React.FC<WebSocketClientProps> = ({ url = 'ws://localhost:9091/ws' }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">WebSocket Client</h3>
      
      <div className="mb-2">
        <span className={`px-2 py-1 rounded text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Enter message..."
          className="w-full p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Send
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto">
        <h4 className="font-semibold mb-2">Messages:</h4>
        {messages.map((msg, index) => (
          <div key={index} className="p-2 mb-1 bg-gray-100 rounded">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebSocketClient;
