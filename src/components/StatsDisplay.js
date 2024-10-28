// components/StatsDisplay.js
import { useEffect, useState } from 'react';

const StatsDisplay = ({ socket }) => {
    const [viewerCount, setViewerCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [diamondsCount, setDiamondsCount] = useState(0);

    useEffect(() => {
        setViewerCount(0);
        setLikeCount(0);
        setDiamondsCount(0);

        if (!socket) return;

        socket.on('roomUser', (msg) => setViewerCount(msg.viewerCount));
        socket.on('like', (msg) => setLikeCount(msg.totalLikeCount));
        socket.on('gift', (gift) => {
            setDiamondsCount((prev) => prev + gift.diamondCount * gift.repeatCount);
        });

        return () => {
            socket.off('roomUser');
            socket.off('like');
            socket.off('gift');
        };
    }, [socket]);

    return (
        <div className="flex justify-between bg-gray-800 rounded-lg shadow-md p-4 text-gray-200 mb-4">
            <div className="text-center mx-5">
                <span className="block font-semibold text-lg text-amber-500">Viewers</span>
                <span>{viewerCount}</span>
            </div>
            <div className="text-center mx-5">
                <span className="block font-semibold text-lg text-pink-500">Likes</span>
                <span>{likeCount}</span>
            </div>
            <div className="text-center mx-5">
                <span className="block font-semibold text-lg text-blue-500">Diamonds</span>
                <span>{diamondsCount}</span>
            </div>
        </div>
    );
};

export default StatsDisplay;
