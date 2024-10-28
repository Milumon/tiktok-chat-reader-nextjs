// lib/limiter.js
let ipRequestCounts = {};

const maxIpConnections = 10;
const maxIpRequestsPerMinute = 5;

setInterval(() => {
    ipRequestCounts = {};
}, 60 * 1000);

function clientBlocked(io, currentSocket) {
    const ipCounts = getOverallIpConnectionCounts(io);
    const currentIp = getSocketIp(currentSocket);

    if (typeof currentIp !== 'string') {
        console.info('LIMITER: Failed to retrieve socket IP.');
        return false;
    }

    const currentIpConnections = ipCounts[currentIp] || 0;
    const currentIpRequests = ipRequestCounts[currentIp] || 0;

    ipRequestCounts[currentIp] = currentIpRequests + 1;

    if (currentIpConnections > maxIpConnections) {
        console.info(`LIMITER: Max connection count of ${maxIpConnections} exceeded for client ${currentIp}`);
        return true;
    }

    if (currentIpRequests > maxIpRequestsPerMinute) {
        console.info(`LIMITER: Max request count of ${maxIpRequestsPerMinute} exceeded for client ${currentIp}`);
        return true;
    }

    return false;
}

function getOverallIpConnectionCounts(io) {
    const ipCounts = {};

    io.of('/').sockets.forEach(socket => {
        const ip = getSocketIp(socket);
        ipCounts[ip] = (ipCounts[ip] || 0) + 1;
    });

    return ipCounts;
}

function getSocketIp(socket) {
    const forwardedIp = socket.handshake.headers['x-forwarded-for'];
    return ['::1', '::ffff:127.0.0.1'].includes(socket.handshake.address) ? forwardedIp : socket.handshake.address;
}

module.exports = {
    clientBlocked,
};
