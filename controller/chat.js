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
                    global.io.to(online.socketId).emit("request-conversation", {
                        creator,
                        conId: request.conversationId,
                        createdAt: request.createdAt 
                    });
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
    const { conId } = req.body;
    const receiver = req.username;
    try {
        const conversation = await Cons.getConversationById(conId);
        if (!conversation || conversation.status === "accept") {
            return res.json({ status: "failure", error: "Invalid Conversation Request" });
        }
        else {
            // post to socket.io of the creator 
            const request = await Cons.acceptRequest(conId, receiver);
            const onlines = await Online.findUserByUsername(request.user);
            if (request.status === "ok") {
                onlines.forEach((online) => {
                    global.io.to(online.socketId).emit("accept-conversation", 
                    { 
                        receiver,
                        conId: request.conversationId, 
                        createdAt: request.createdAt 
                    });
                });
            }
            return res.json(request);
        }
    }
    catch (error) {
        return res.json({ status: "error", error: `System Error: ${error.message}` });
    }
}

// delete conversations
const deleteConversation = async function (req, res) {
    const username = req.username;
    const { conId } = req.body;
    try {
        const isExist = await Users.findUser(username);
        if (!isExist) {
            return res.json({ status: "failure", error: "Invalid username" });
        } else {
            const request = await Cons.deleteConversation(conId, username);
            const onlines = await Online.findUserByUsername(request.user);
            if (request.status === "ok") {
                Message.deleteMessagesById(conId);
                onlines.forEach((online) => {
                    global.io.to(online.socketId).emit("delete-conversation", 
                    { 
                        conId: request.conversationId 
                    });
                });
            }
            return res.json(request);
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
const postMessage = async function (req, res) {
    const username = req.username;
    const { conId, receiver, message } = req.body;
    try {
        const send = await Users.findUser(username);
        const receive = await Users.findUser(receiver);
        if (message.length <= 100 && message.length >= 1 && send && receive) {
            // Post to db
            const post = await Message.postMessage(username, receiver, message, conId);
            // send to receiver sockets
            const online = await Online.findUserByUsername(receiver);
            online.forEach((user) => {
                global.io.to(user.socketId).emit("display-receive",
                    {
                        "conId": conId,
                        "sender": username,
                        "message": message,
                        "time": post.createdAt
                    });
            })
            return res.json({ status: "ok", result: post });
        }
        else {
            return res.json({ status: "failure" });
        }
    } catch (error) {
        return res.json({ status: "error", error: `System Error: ${error.message}` })
    }
}

// get messages
const retrieveMessages = async function (req, res) {
    const receiver = req.username;
    const { conId } = req.params;
    try {
        const conversation = await Cons.getConversationById(conId);
        if (conversation.userIds[0] === receiver || conversation.userIds[1]) {
            const messages = await Message.getMessagesById(conId);
            const result = [];
            messages.forEach((msg) => {
                result.push(
                    {
                        "isSender": (receiver === msg.sender) ? true : false,
                        "message": msg.message,
                        "createdAt": msg.createdAt
                    });
            });
            return res.json({
                status: "ok",
                result,
                you: receiver,
                other: (conversation.creator === receiver) ? conversation.userIds[1] : conversation.userIds[0]
            });
        } else {
            return res.json({ status: "failure", error: "Current user has no access to the messages" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ status: "error", error: `System Error: ${error.message}` });
    }
}


module.exports = { sendConversationRequest, retrieveConversations, acceptConversationRequest, deleteConversation, retrieveMessages, postMessage }; 