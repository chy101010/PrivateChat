const express = require('express');
// controllers
const chat = require("../controller/chat.js")

const router = express.Router();
router.get('/send/:receiver', chat.sendConversationRequest);
router.get('/retrieve', chat.retrieveConversations);
router.get('/messages/:conId', chat.retrieveMessages)
router.post('/post', chat.postMessage);
router.post('/accept', chat.acceptConversationRequest);
router.post('/delete', chat.deleteConversation);
router.post('send/message', chat.postMessage);


module.exports = router;