const Users = require('../model/user');
const Message = require('../model/message');
const Online = require('../model/online');
const Cons = require('../model/conversation');

// send conversations request
const sendConversationRequest = async function (req, res) {
    const { receiver } = req.params;
    const creator = req.username;
    try {
        const isExist = await Users.findUser(receiver);
        if (!isExist || receiver === creator) {
            return res.json({ status: "failure" });
        } else {
            const request = await Cons.sendRequest(creator, isExist.username);
            const receivers = await Online.findUserByUsername(receiver);
            if (request.status !== "duplicate") {
                receivers.forEach((online) => {
                    global.io.to(online.socketId).emit("request-conversation", { creator, conId: request.conversationId });
                });
            }
            return res.json(request);
        }
    }
    catch (error) {
        return res.json({ status: "error", error: `System Error: ${error.message}` });
    }
}

// accept conversations request 
const acceptConversationRequest = async function (req, res) {
    const { conId } = req.params;
    const receiver = req.username;
    try {
        const conversation = await Cons.getConversationById(conId);
        if (!conversation || conversation.status === "accept") {
            return res.json({ status: "failure", error: "Invalid Conversation Request" });
        }
        else {
            // post to socket.io of the creator 
            return res.json(await Cons.acceptRequest(conId, receiver));
        }
    }
    catch (error) {
        return res.json({ status: "error", error: `System Error: ${error.message}` });
    }
}

// delete conversations
const deleteConversation = async function (req, res) {
    const username = req.username;
    const { conId } = req.params;
    try {
        const isExist = await Users.findUser(username);
        if (!isExist) {
            return res.json({ status: "failure", error: "Invalid username" });
        } else {
            return res.json(await Cons.deleteConversation(conId, username));
        }
    } catch (error) {
        return res.json({ status: "error", error: `System Error: ${error.message}` });
    }
}

// retrieve converstaions 
const retrieveConversations = async function (req, res) {
    const receiver = req.username;
    try {
        const isExist = await Users.findUser(receiver);
        if (!isExist) {
            return res.json({ status: "failure", error: "Invalid username" });
        } else {
            return res.json({ conversations: await Cons.getConversationsByUsername(receiver), receiver });
        }
    } catch (error) {
        return res.json({ status: "error", error: `System Error: ${error.message}` });
    }
}


// type message

// get messages




const createConversation = async function (req, res) {
    const { receiver } = req.params;
    try {
        const result = await Users.findUser(receiver);
        const onlines = await Online.findUserByUsername(result.username);
        if (result) {
            onlines.forEach((online) => {
                global.io.to(online.socketId).emit("incoming-conversation", req.username);
            })
            return res.json({ status: "ok", receiver: result.username });
        }
        else {
            return res.json({ status: "failure", error: "The given receiver is undefined" });
        }
    }
    catch (error) {
        return res.json({ status: "error", error: `System Error: ${error.message}` })
    }
}

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

module.exports = { sendConversationRequest, retrieveConversations, acceptConversationRequest}; 