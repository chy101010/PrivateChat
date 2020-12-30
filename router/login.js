const express = require('express');
// controllers
const user = require("../controller/login.js")

const router = express.Router();
router.post('/submit', user.submitLogin);

module.exports = router;