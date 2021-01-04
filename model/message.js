const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        sender: { type: String, required: true },
        receiver: { type: String, require: true },
        message: { type: String, minlength: 1, maxlength: 100 },
        read: { type: Boolean, default: false}
    },
    {
        timestamps: true,
        collection: 'message'
    }
)

MessageSchema.statics.postMessage = async function (sender, receiver, message) {
    try {
        const result = await this.create({ sender, receiver, message });
        return result;
    } catch (error) {
        throw error;
    }
}

MessageSchema.statics.receiveMessage = async function (receiver) {

}


const model = mongoose.model('MessageSchema', MessageSchema);

module.exports = model;