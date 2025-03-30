import { useState, useEffect, use } from 'react';
import axios from 'axios';
import clsx from 'clsx';

export default function ChatApp({ initialPrompt }) {
  const [inputText, setInputText] = useState('');
  const [defaultinputText, setDefaultInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const message = inputText;
    if (!message.trim()) return;
    console.log("In Handle Function : ", message)
    const newMessage = { text: message, sender: 'user' }
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      // const response = await axios.post('http://localhost:5000/chat?data=' + encodeURIComponent(inputText));
      //   const response = await axios.post('https://chatbot-openthaigpt-demo.onrender.com/chat?data=' + encodeURIComponent(inputText));
      const response = await axios.post('https://chatbot-4o-mini-demo.onrender.com/chat?data=' + encodeURIComponent(inputText));
      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }

    setInputText('');
  };

  function formatChatGPTResponse(text) {
    text = removeDuplicateLines(text); // 👈 clean up first

    const lines = text.split('\n').filter(line => line.trim() !== '');
    let formatted = '';

    // Detect if it's a list-style message
    const isList = lines.some(line => line.match(/^\d+\.\s\*\*/));

    if (isList) {
      formatted += `<p>${lines[0]}</p><ol>`;
      for (let i = 1; i < lines.length; i++) {
        const match = lines[i].match(/^\d+\.\s\*\*(.+?)\*\*\:\s(.+)/);
        if (match) {
          const title = match[1];
          const detail = match[2];
          formatted += `<li><strong>${title}</strong>: ${detail}</li>`;
        }
      }
      formatted += '</ol>';
    } else {
      // Fallback to paragraphs
      formatted = lines.map(line => `<p>${line}</p>`).join('');
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
    <div className="flex flex-col items-center h-[400px] w-[370px] md:w-[400px] p-4 ">
      <div className="w-full max-w-lg bg-white border-black border-2 rounded-lg p-4 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, idx) => (
            msg.sender === 'bot' ? (
              <div
                key={idx}
                dangerouslySetInnerHTML={{ __html: formatChatGPTResponse(msg.text) }}
                className="mb-2 p-2 rounded-lg bg-gray-200 text-black self-start"
              />
            ) : (
              <div
                key={idx}
                className="mb-2 p-2 rounded-lg border-2 border-black text-black self-end"
              >
                {msg.text}
              </div>
            )
          ))}
          {loading && <div className="text-center text-gray-500">Typing...</div>}
        </div>

        <div className="flex items-center gap-2 justify-between w-[305px] md:w-auto ">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Ask anything..."
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
