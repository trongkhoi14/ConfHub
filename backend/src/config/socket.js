const { Server } = require('socket.io');
const { increaseUserLog } = require('../utils/dashboard');

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

const socketListening = (io) => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }

    io.on('connection', (socket) => {
        let userID = socket.handshake.query['user-id'];

        if (!userID || userID == 'null') {
            userID = 'guest' + Math.random();
        }

        if (userID) {
            users.set(userID, socket.id);
            console.log(`User ${userID} registered with socket ID ${socket.id}`);
            io.emit('currentUser', users.size);
            increaseUserLog();

        } else {
            console.log('No user ID found in headers.');
        }

        socket.on('disconnect', () => {
            console.log('User disconnected');
            for (let [userID, socketID] of users) {
                if (socketID === socket.id) {
                    users.delete(userID);
                    break;
                }
            }
            io.emit('currentUser', users.size);
        });
    });
}


module.exports = {
    initSocket,
    getIO,
    users,
    socketJob,
    socketListening
};