const onlineUsers = require("../model/online");
const Users = require("../model/user");
const jwt = require('jsonwebtoken');
require('dotenv').config();

class WebSocket {
    connection(user) {
        // handle socket disconnect
        user.on('disconnect', async () => {
            const disconnected = await onlineUsers.findUserBySocketId(user.id);
            if (!disconnected) {
                return console.log('Disconnect: anonymous user')
            }
            onlineUsers.logOffLine(user.id);
            console.log(`Disconnect: ${disconnected}`);
        })

        // handle socket connection
        user.on('connection', async (token) => {
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                if (!(await Users.findUser(decoded.username))) {
                    throw new Error("");
                }
                const connected = await onlineUsers.logOnline(decoded.username, user.id);
                console.log(`Connect:${connected}`);
            } catch {
                global.io.to(user.id).emit("redirect");
                user.disconnect();
            }
        })
    }
}


exports.WebSocket = new WebSocket();