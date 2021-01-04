const express = require('express');
// controllers
const chat = require("../controller/chat.js")

const router = express.Router();
router.get('/create/:receiver', chat.createConversation);
router.post('/post', chat.postMessage);

module.exports = router;