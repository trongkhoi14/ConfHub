const { Server } = require('socket.io');

let io;
const users = new Map();

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
        }
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
    users
};