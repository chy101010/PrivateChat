const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { collection: 'users' }
)

/**
 * @param {String} username
 * @param {String} password
 */
UserSchema.statics.createUser = async function (username, password) {
    try {
        const user = await this.create({ username, password });
        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * @param {String} username 
 */
UserSchema.statics.findUser = async function (username) {
    try {
        const user = await this.findOne({ "username": username });
        return user;
    } catch (error) {
        throw error;
    }
}

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;