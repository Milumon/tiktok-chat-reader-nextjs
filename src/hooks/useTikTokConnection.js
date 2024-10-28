// src/hooks/useTikTokConnection.js
import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const useTikTokConnection = (backendUrl, username) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null); // Store error messages

    useEffect(() => {
        if (!username || typeof window === 'undefined') return;

        // Clean up previous socket connection
        if (socket) {
            socket.disconnect();
            setIsConnected(false);
        }

        // Initialize new socket connection
        const newSocket = io(backendUrl || "http://localhost:8081");
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.info("Socket connected!");
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.warn("Socket disconnected!");
        });

        return () => {
            newSocket.disconnect();
            setIsConnected(false);
        };
    }, [backendUrl, username]);

    const connectToTikTok = useCallback((uniqueId, options) => {
        return new Promise((resolve, reject) => {
            if (!socket || !isConnected) {
                const errorMsg = !socket ? "Socket is not initialized" : "Socket is not connected";
                console.error(errorMsg);
                reject(errorMsg);
                return;
            }

            // Clear previous event listeners
            socket.off('tiktokConnected');
            socket.off('tiktokDisconnected');

            // Attempt to connect to TikTok room
            console.log("Attempting to connect with uniqueId =", uniqueId);
            socket.emit('setUniqueId', uniqueId, options);
            socket.once('tiktokConnected', resolve);

            socket.once('tiktokDisconnected', (error) => {
                console.error("Disconnected from TikTok room:", error);
                setErrorMessage("Failed to connect to TikTok room. Please check if the user is live.");
                reject("Connection lost");
            });

            setTimeout(() => {
                setErrorMessage("Connection Timeout. The user might not be live.");
                reject('Connection Timeout');
            }, 15000);
        });
    }, [socket, isConnected]);

    return { socket, connectToTikTok, isConnected, errorMessage };
};

export default useTikTokConnection;
