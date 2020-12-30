const express = require('express');
// controllers
const user = require("../controller/register.js")

const router = express.Router();
router.post('/submit', user.submitRegistration);

module.exports = router;