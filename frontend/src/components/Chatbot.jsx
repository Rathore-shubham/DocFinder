import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false); // Initially closed
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;
    
        const userMessage = { sender: "user", text: input };
        
        // Update messages state correctly
        setMessages((prevMessages) => [...prevMessages, userMessage]);
    
        try {
            const { data } = await axios.post("http://localhost:4000/api/chatbot", { message: input });
    
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: data.reply }]);
        } catch (error) {
            console.error("Chatbot Error:", error);
        }
    
        setInput("");
    };
    

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
                >
                    Open Chatbot
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-4 right-4 w-80 bg-zinc-900 shadow-lg rounded-lg flex flex-col overflow-hidden">
                    <div className="bg-blue-600 text-white text-center py-2 font-semibold flex justify-between px-3">
                        <span>Chatbot</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white text-lg hover:text-gray-300"
                        >
                            ✖
                        </button>
                    </div>

                    <div className="h-64 overflow-y-auto p-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 my-1 rounded-lg text-sm max-w-[80%] ${
                                    msg.sender === "user"
                                        ? "bg-blue-500 text-white self-end ml-auto"
                                        : "bg-green-500 text-white self-start mr-auto"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex border-t border-gray-700">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 text-sm bg-zinc-800 text-white outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-gray-600 px-4 py-2 text-white text-sm hover:bg-red-600"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
