// components/ChatContainer.js
import { useEffect, useState, useRef } from "react";

const ChatContainer = ({ socket, username }) => {
  const [chats, setChats] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("chat", (msg) => {
      setChats((prevChats) => [...prevChats, msg]);
    });

    return () => socket.off("chat");
  }, [socket]);

  useEffect(() => {
    setChats([]);
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-4 text-gray-200">
      <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">
        Chats
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-thin">
        {chats.map((chat, index) => (
          <div
            key={index}
            className="bg-gray-800 p-3 mr-2 rounded-lg shadow-inner text-sm"
          >
            <strong className="text-amber-500">{chat.uniqueId}:</strong>{" "}
            <span className="text-gray-300">{chat.comment}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
