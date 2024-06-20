const { Server } = require('socket.io');

let io;
const users = new Map();
const socketJob = new Array();

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
        },
        path: '/socket.io',
        transports: ['websocket', 'polling']
    });
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = {
    initSocket,
    getIO,
    users,
    socketJob
};