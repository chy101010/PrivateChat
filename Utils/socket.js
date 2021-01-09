const OnlineUsers = require("../model/online");
const Users = require("../model/user");
const Message = require("../model/message");
const jwt = require('jsonwebtoken');
require('dotenv').config();

class WebSocket {
    connection(user) {
        // handle socket disconnect
        user.on('disconnect', async () => {
            const disconnected = await OnlineUsers.findUserBySocketId(user.id);
            if (!disconnected) {
                return console.log('Disconnect: anonymous user')
            }
            // log off in database
            OnlineUsers.logOffLine(user.id);
            console.log(`Disconnect: ${disconnected}`);
        })

        // handle socket identity
        user.on('identity', async (token) => {
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                if (!(await Users.findUser(decoded.username))) {
                    throw new Error("");
                }
                global.io.to(user.id).emit("receive-identity", decoded.username, user.id);
                const connected = await OnlineUsers.logOnline(decoded.username, user.id);
                console.log(`Connect:${connected}`);
            } catch {
                global.io.to(user.id).emit("redirect");
                user.disconnect();
            }
        })
    }
}


exports.WebSocket = new WebSocket();
