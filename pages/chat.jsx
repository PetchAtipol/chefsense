import { useState, useEffect, use } from 'react';
import axios from 'axios';


export default function ChatApp({ initialPrompt }) {
  const [inputText, setInputText] = useState('');
  const [defaultinputText, setDefaultInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const handleSend = async () => {
    const message = inputText;
    if (!message.trim()) return;
    console.log("In Handle Function : ", message)
    const newMessage = { text: message, sender: 'user' }
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      setInputText('');
      // const response = await axios.post('http://localhost:5000/chat?data=' + encodeURIComponent(inputText));
      //   const response = await axios.post('https://chatbot-openthaigpt-demo.onrender.com/chat?data=' + encodeURIComponent(inputText));
      const response = await axios.post('https://chatbot-4o-mini-demo.onrender.com/chat?data=' + encodeURIComponent(inputText));
      const botMessage = { text: response.data.response, sender: 'bot' };
      console.log('🧠 AI Response:', response.data.response);
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }

  };

  function formatChatGPTResponse(text) {
    text = removeDuplicateLines(text);

    const lines = text.split('\n').filter(line => line.trim() !== '');
    let formatted = '';
    let currentItem = '';
    let inList = false;

    for (let line of lines) {
      const listStart = line.match(/^\d+\.\s\*\*(.+?)\*\*/); // Match: 1. **Title**

      if (listStart) {
        if (inList) {
          formatted += `<li>${currentItem}</li>`;
          currentItem = '';
        } else {
          formatted += `<ol>`;
          inList = true;
        }

        const title = listStart[1];
        currentItem = `<strong>${title}</strong>`;
      } else if (inList && line.startsWith('-')) {
        currentItem += `<br/>${line.trim()}`;
      } else {
        if (inList) {
          formatted += `<li>${currentItem}</li></ol>`;
          inList = false;
          currentItem = '';
        }
        formatted += `<p>${line}</p>`;
      }
    }

    if (inList && currentItem) {
      formatted += `<li>${currentItem}</li></ol>`;
    }

    return formatted;
  }


  function removeDuplicateLines(text) {
    const lines = text.split('\n');
    return lines.filter((line, index, arr) => line !== arr[index - 1]).join('\n');
  }

  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
      console.log("Chat Prompt :", typeof (initialPrompt))
      // handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  return (
    <div className="flex flex-col items-center h-[400px] w-[370px] md:w-[400px] p-4">
      <div className="w-full h-full bg-white border-2 border-gray-300 rounded-xl shadow-lg p-4 flex flex-col">

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto pr-1 mb-3 space-y-2">
          {messages.map((msg, idx) =>
            msg.sender === 'bot' ? (
              <div
                key={idx}
                dangerouslySetInnerHTML={{ __html: formatChatGPTResponse(msg.text) }}
                className="bg-green-100 text-black p-3 rounded-lg shadow-sm w-fit max-w-full"
              />
            ) : (
              <div
                key={idx}
                className="bg-white border border-black text-black p-3 rounded-lg shadow-sm self-end w-full max-w-full"
              >
                {msg.text}
              </div>
            )
          )}
          {loading && <div className="text-center text-gray-500 text-sm">AI is thinking...</div>}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 mt-auto">
          <input
            type="text"
            placeholder="Ask anything..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:bg-green-800 transition duration-150"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
