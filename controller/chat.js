const Users = require('../model/user');
const Message = require('../model/message');
const Online = require('../model/online');
const Cons = require('../model/conversation');


// send conversations request
const sendConversationRequest = async function (req, res) {
    const {receiver} = req.params;
    try{

    }
    catch(error) {
        
    }
}

// delete conversations

// accept conversations request 

// retrieve converstaions 

// type message

// get messages




// const createConversation = async function (req, res) {
//     const { receiver } = req.params;
//     try {
//         const result = await Users.findUser(receiver);
//         const onlines = await Online.findUserByUsername(result.username);
//         if (result) {
//             onlines.forEach((online) =>{
//                 global.io.to(online.socketId).emit("incoming-conversation", req.username);
//             })
//             return res.json({ status: "ok", receiver: result.username });
//         }
//         else {
//             return res.json({ status: "failure", error: "The given receiver is undefined" });
//         }
//     }
//     catch (error) {
//         return res.json({ status: "error", error: `System Error: ${error.message}` })
//     }
// }

// const postMessage = async function (req, res) {
//     const username = req.username;
//     const receiver = req.body.receiver;
//     const message = req.body.message;
//     try {
//         const send = await Users.findUser(username);
//         const receive = await Users.findUser(receiver);
//         if (message.length <= 100 && message.length >= 1 && send && receive) {
//             // Post to db
//             // const post = await Message.postMessage(username, receiver, message);
//             // send to receiver sockets
//             const online = await Online.findUserByUsername(receiver);
//             online.forEach((user) => {
//                 global.io.to(user.socketId).emit("display-receive", { "message": message });
//             })
//             return res.json({ status: "ok", "message": message });
//         }
//         else {
//             return res.json({ status: "failure" });
//         }
//     } catch (error) {
//         return res.json({ status: "error", error: `System Error: ${error.message}` })
//     }
// }

module.exports = { createConversation, postMessage }; 