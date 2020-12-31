const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateJwt = function (req, res, next) {
    if (!req.token) {
        res.json({ status: "error", error: "No access token provided" });
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.username = decoded.username;
        next();
    } catch (error) {
        res.json({status: "error", error: "Invalide access token"});
    }
}


exports.validateJwt = validateJwt;