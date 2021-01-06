const express = require('express');
// controllers
const chat = require("../controller/chat.js")

const router = express.Router();
router.get('/send/:receiver', chat.sendConversationRequest);
router.get('/accept/:conId')
router.get('/retrieve', chat.retrieveConversations);
// router.post('/post', chat.postMessage);

module.exports = router;