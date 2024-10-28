// src/app/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useTikTokConnection from '../hooks/useTikTokConnection';
import ChatContainer from '../components/ChatContainer';
import GiftContainer from '../components/GiftContainer';
import StatsDisplay from '../components/StatsDisplay';

export default function Home() {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { socket, connectToTikTok, isConnected } = useTikTokConnection("http://localhost:8081", username);

    // Ensure the component only renders after mounting on the client
    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!username || !isConnected) return;

        const handleConnect = async () => {
            try {
                await connectToTikTok(username, { enableExtendedGiftInfo: true });
                setErrorMessage(''); // Clear error message on successful connection
                console.info('Successfully connected to TikTok');
            } catch (error) {
                console.error('Connection failed:', error);
                setErrorMessage("Connection failed: Invalid username or user not found.");
            }
        };

        handleConnect();
    }, [username, isConnected, connectToTikTok]);

    // Clear error message if `isConnected` changes to true
    useEffect(() => {
        if (isConnected) {
            setErrorMessage('');
        }
    }, [isConnected]);

    // Prevent rendering on the server by returning null during SSR
    if (!hasMounted) return null;

    // Handle OBS Overlay navigation
    const handleNavigateToOBS = () => {
        if (username) {
            router.push(`/obs?username=${username}`);
        } else {
            setErrorMessage('Please enter a username before proceeding to OBS overlay.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6 space-y-6">
            <h1 className="text-2xl font-bold">TikTok LIVE Chat Reader</h1>
            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder="@username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setErrorMessage('');  // Clear any error when updating username
                    }}
                    className="p-2 rounded bg-gray-800 text-gray-300 focus:outline-none"
                />
                <button
                    onClick={() => setUsername(username)}
                    disabled={isConnected}
                    className={`px-4 py-2 rounded bg-blue-600 text-white ${
                        isConnected ? 'bg-gray-500 cursor-not-allowed' : 'hover:bg-blue-500'
                    }`}
                >
                    {isConnected ? 'Connected' : 'Connect'}
                </button>
            </div>

            {!isConnected && errorMessage && (
                <p className="text-red-500 mt-4">{errorMessage}</p>
            )}

            {isConnected && (
                <>
                    <StatsDisplay socket={socket} />
                    <div className="flex flex-col sm:flex-row md:space-x-4 space-y-4 md:space-y-0 w-full max-w-4xl">
                        <ChatContainer socket={socket} username={username} />
                        <GiftContainer socket={socket} username={username} />
                    </div>

                    {/* OBS Overlay Button */}
                    <button
                        onClick={handleNavigateToOBS}
                        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                    >
                        OBS Overlay
                    </button>
                </>
            )}
        </div>
    );
}
