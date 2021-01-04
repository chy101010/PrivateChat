// Dependencies
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('./database/mongo');
const io = require('socket.io');
const http = require('http');

const app = express();
const port = 3000;

// routes
const register = require("./router/register");
const login = require("./router/login");
const chat = require("./router/chat");

// socket 
const { WebSocket } = require("./Utils/socket.js");

// middlewares 
const {validateJwt} = require("./middlewares/validateJwt");

// Middlewares
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use("/register", register);
app.use("/login", login);
app.use("/api/chat", validateJwt, chat);

app.get("", (req, res) => {
    res.redirect('/login');
})

// send login view
app.get('/login', (req, res) => {
    return res.sendFile(__dirname + "/public/login.html");
})

// send register view
app.get('/register', (req, res) => {
    return res.sendFile(__dirname + "/public/register.html");
})

// send chat view
app.get('/chat', (req, res) => {
    return res.sendFile(__dirname + "/public/chat.html");
})


// Create HTTP server
const server = http.createServer(app);
// Intergrating socket connection
socket = io(http);
global.io = socket.listen(server);
global.io.on('connection', WebSocket.connection);

// listening at port 3000
server.listen(port, () => {
    console.log("Listening at *3000");
})