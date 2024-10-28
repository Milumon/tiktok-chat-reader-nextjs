// src/app/obs/page.js
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChatContainer from "../../components/ChatContainer";
import GiftContainer from "../../components/GiftContainer";
import StatsDisplay from "../../components/StatsDisplay";
import useTikTokConnection from "../../hooks/useTikTokConnection";

export default function OBSOverlay() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username"); // Retrieve `username` from URL

  // Pass `username` into `useTikTokConnection`
  const { socket, connectToTikTok, isConnected } = useTikTokConnection("http://localhost:8081", username);

  const bgColor = searchParams.get("bgColor") || "rgb(24,23,28)";
  const fontColor = searchParams.get("fontColor") || "rgb(227,229,235)";
  const fontSize = searchParams.get("fontSize") || "1.3em";

  useEffect(() => {
    console.log("OBSOverlay: username =", username);
    console.log("OBSOverlay: isConnected =", isConnected);

    if (username && isConnected) {
      connectToTikTok(username, { enableExtendedGiftInfo: true }).catch(error => {
        console.error("OBSOverlay: Connection failed:", error);
      });
    }
  }, [username, isConnected, connectToTikTok]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6 space-y-6">

      <StatsDisplay socket={socket} />
      <div className="flex flex-col sm:flex-row md:space-x-4 space-y-4 md:space-y-0 w-full max-w-4xl">
      <ChatContainer socket={socket} username={username} />
        <GiftContainer socket={socket} username={username} />
      </div>
    </div>
  );
}
