import { useState } from 'react';
import axios from 'axios';

export default function ChatApp() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const newMessage = { text: inputText, sender: 'user' };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/chat?data=' + encodeURIComponent(inputText));
      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }

    setInputText('');
  };

  return (
    <div className="flex flex-col items-center h-[400px] w-[400px] p-4 ">
      <div className="w-full max-w-lg bg-white border-black border-2 rounded-lg p-4 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 p-2 rounded-lg ${msg.sender === 'user' ? 'border-2 border-black text-black self-end' : 'bg-gray-200 text-black self-start'}`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-center text-gray-500">Typing...</div>}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="พิมพ์ข้อความ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="py-1.5 px-4 rounded-md font-medium hover:bg-black hover:border-2 hover:text-white duration-100 active:bg-white active:bottom-2 active:text-black border-black border-2 "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
