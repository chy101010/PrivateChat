const mongoose = require("mongoose");

const OnlineSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        socketId: { type: String, required: true }
    },
    { collection: 'online' }
)

/**
 * Whenever a user is connected to the server, log them to the database
 * @param {String} username
 * @param {String} socketId
 */
OnlineSchema.statics.logOnline = async function (username, socketId) {
    try {
        const result = await this.create({ username, socketId });
        return result;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Whenever a user is disconnected to the server, remove them from the database 
 * @param {String} usern 
 */
OnlineSchema.statics.logOffLine = async function (socketId) {
    try {
        const result = await this.deleteOne({ "socketId": socketId });
        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * Find the all the connections of the given username
 * @param {String} username 
 */
OnlineSchema.statics.findUserByUsername = async function (username) {
    try {
        const users = await this.find({ "username" : username });
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * Find the all the connections of the given username
 * @param {String} username 
 */
OnlineSchema.statics.findUserBySocketId = async function (socketId) {
    try {
        const users = await this.findOne({ "socketId": socketId });
        return users;
    } catch (error) {
        throw error;
    }
}

OnlineSchema.statics.logOffAll = async function () {
    try {
        const result = await this.deleteMany({});
        return result;
    } catch (error) {
        throw error;
    }
}

const model = mongoose.model('OnlineSchema', OnlineSchema);

module.exports = model;