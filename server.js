// Dependencies
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const io = require('socket.io');
const http = require('http');

const app = express();
const port = 3000;

// routes
const register = require("./router/register");
const login = require("./router/login");

// socket 
const { WebSocket } = require("./Utils/socket.js");

// middlewares 
const {validateJwt} = require("./middlewares/validateJwt");

// connecting to mongo
mongoose.connect('mongodb://localhost:27017/chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log("Connected to Mongo");
})

mongoose.connection.on('disconnected', () => {
    console.log("Disconnected from Mongo");
})

mongoose.connection.on('error', (error) => {
    console.log(`Failing to connect to Mongo`);
    mongoose.disconnect();
})

// Middlewares
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use("/register", register);
app.use("/login", login);

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