// server.js
require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');
const { TikTokConnectionWrapper, getGlobalConnectionCount } = require('./lib/connectionWrapper');
const { clientBlocked } = require('./lib/limiter');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = createServer(server);
    const io = new Server(httpServer, {
        cors: { origin: '*' },
    });

    io.on('connection', (socket) => {
        let tiktokConnectionWrapper;
        console.info('New client connected.');

        socket.on('setUniqueId', (uniqueId, options) => {
            if (typeof options === 'object' && options) {
                delete options.requestOptions;
                delete options.websocketOptions;
            } else {
                options = {};
            }

            if (process.env.SESSIONID) {
                options.sessionId = process.env.SESSIONID;
            }

            if (process.env.ENABLE_RATE_LIMIT && clientBlocked(io, socket)) {
                socket.emit('tiktokDisconnected', 'Connection limit exceeded.');
                return;
            }

            try {
                tiktokConnectionWrapper = new TikTokConnectionWrapper(uniqueId, options, true);
                tiktokConnectionWrapper.connect();
            } catch (err) {
                socket.emit('tiktokDisconnected', err.toString());
                return;
            }

            tiktokConnectionWrapper.once('connected', state => socket.emit('tiktokConnected', state));
            tiktokConnectionWrapper.once('disconnected', reason => socket.emit('tiktokDisconnected', reason));

            tiktokConnectionWrapper.connection.on('streamEnd', () => socket.emit('streamEnd'));
            tiktokConnectionWrapper.connection.on('roomUser', msg => socket.emit('roomUser', msg));
            tiktokConnectionWrapper.connection.on('chat', msg => socket.emit('chat', msg));
            tiktokConnectionWrapper.connection.on('gift', msg => socket.emit('gift', msg));
        });

        socket.on('disconnect', () => {
            if (tiktokConnectionWrapper) {
                tiktokConnectionWrapper.disconnect();
            }
        });
    });

    setInterval(() => {
        io.emit('statistic', { globalConnectionCount: getGlobalConnectionCount() });
    }, 5000);

    server.all('*', (req, res) => handle(req, res));

    const port = process.env.PORT || 8081;
    httpServer.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
