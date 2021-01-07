const mongoose = require('mongoose');
const online = require("../model/online");

// connecting to mongo
mongoose.connect('mongodb://localhost:27017/chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on('connected', async () => {
    console.log(await online.logOffAll());
    console.log("Connected to Mongo");
})

mongoose.connection.on('disconnected', () => {
    console.log("Disconnected from Mongo");
})

mongoose.connection.on('error', (error) => {
    console.log(`Failing to connect to Mongo`);
    mongoose.disconnect();
})