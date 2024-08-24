"use client";
import { useState, useEffect, useRef } from "react";
import { AiOutlineMessage, AiOutlineClose } from "react-icons/ai";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const ChatAiButton = ({ initialResponse = "", initialRequestContent = "" }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(initialResponse);
  const [requestContent, setRequestContent] = useState(initialRequestContent);
  const [isLoading, setIsLoading] = useState(false);

  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const driverObj = driver();
      driverObj.highlight({
        element: "#ai-response",
        popover: {
          showButtons: ["close"],
          side: "bottom",
          title: "AI Generated",
          description: "Lets talk about it",
        },
      });
    }, 5000); // 5 detik

    // Cleanup untuk timer utama
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fungsi untuk melakukan scroll ke bagian bawah setiap kali respons berubah
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setRequestContent(message);
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://flask-ai-three.vercel.app/v1/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: message,
            }),
          }
        );
        const data = await response.json();
        // Panggil display function untuk menampilkan respon secara bertahap
        display(data.response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
      setMessage("");
    }
  };

  // Fungsi untuk menampilkan respon secara bertahap
  const display = async (text: string) => {
    for (let char of text) {
      setResponse((prevResponse) => prevResponse + char);
      await new Promise((resolve) => setTimeout(resolve, 3));
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-28  right-10 ${
          isChatOpen ? "z-50" : "-z-50"
        } flex flex-col items-end`}
      >
        <div
          className={`transition-transform  transform ${
            isChatOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 w-64 h-80 mb-4 flex flex-col justify-between relative`}
          style={{
            transition: "opacity 0.1s ease, transform 0.3s ease",
            visibility: isChatOpen ? "visible" : "hidden",
            
          }}
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Chat with AI (Beta V1)</h3>
              <button
                onClick={toggleChat}
                className="focus:outline-none"
                aria-label="Close chat"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            <div
              ref={responseRef}
              
              className="h-full overflow-y-auto flex-grow max-h-64"
            >
              <div className="text-right mb-2 text-gray-500">
                {requestContent}
              </div>
              <div className="text-left mb-2">
                {isLoading ? <span>Loading...</span> : response}
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-red-500 text-white p-2 rounded-r-lg focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <div  className={`fixed bottom-7 hover:scale-110 right-7 z-50`}>
        <button
        id="ai-response"
          onClick={toggleChat}
          className="bg-red-500 text-white p-3 rounded-full shadow-lg focus:outline-none"
          aria-label="Open chat"
        >
          <AiOutlineMessage size={24} />
        </button>
      </div>
    </>
  );
};

export default ChatAiButton;
