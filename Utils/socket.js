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
            onlineUsers.logOffLine(user.id);
            console.log(`Disconnect: ${disconnected}`);
        })

        // handle socket identity
        user.on('identity', async (token) => {
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                if (!(await Users.findUser(decoded.username))) {
                    throw new Error("");
                }
                const connected = await OnlineUsers.logOnline(decoded.username, user.id);
                console.log(`Connect:${connected}`);
            } catch {
                global.io.to(user.id).emit("redirect");
                user.disconnect();
            }
        })

        user.on("message", async (token, receiver, msg) => {
            try {
                const sender = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).username;
                const receive = await Users.findUser(receiver);
                if(!receive) {
                    throw new Error("Invalid Receiver");
                }
                const isOnline = await OnlineUsers.findUserByUsername(receiver);
                // Log into the db
                Message.postMessage(sender, receriver, msg);
                // Emit message to the online receiver directly real time
                if(isOnline) {
                    receive.forEach((online) =>{
                        global.io.to(online.socketId).emit("display-message", msg, sender);
                    })
                }
                else {
                    console.log("Receiver is not online thus logged into the db");
                }
            }catch(eror) {
                console.log(error.Message);
            }
        })
    }
}


exports.WebSocket = new WebSocket();