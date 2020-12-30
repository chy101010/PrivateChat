// Dependencies
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// routes
const register = require("./router/register");
const login = require("./router/login");

// connecting to mongo
mongoose.connect('mongodb://localhost:27017/chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const app = express();
const port = 3000;

// Middlewares
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use("/register", register);
app.use("/login", login);

// send login view
app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
})

// send register view
app.get('/register', (req, res) => {
    res.sendFile(__dirname + "/public/register.html");
})

// listening at port 3000
app.listen(port, () => {
    console.log("Listening at *3000");
})