// components/GiftContainer.js
import { useEffect, useState, useRef } from "react";

const GiftContainer = ({ socket, username }) => {
  const [gifts, setGifts] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for new gift messages
    socket.on("gift", (gift) => {
      setGifts((prevGifts) => [...prevGifts, gift]);
    });

    // Clean up event listener on component unmount
    return () => socket.off("gift");
  }, [socket]);

  // Clear gifts when the username changes
  useEffect(() => {
    setGifts([]);
  }, [username]);

  // Scroll to the bottom whenever gifts change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gifts]);

  return (
    <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-4 text-gray-200">
      <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">
      Gifts
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-thin">
        {gifts.map((gift, index) => (
          <div
            key={index}
            className="bg-gray-800 p-3 mr-2 rounded-lg shadow-inner text-sm"
          >
            <strong className="text-purple-500">{gift.uniqueId}:</strong>{" "}
            <span className="text-gray-300">
              {gift.giftName} x{gift.repeatCount}
            </span>
          </div>
        ))}
        {/* Dummy div to scroll to */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default GiftContainer;
