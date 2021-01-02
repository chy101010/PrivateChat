const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        sender: { type: String, required: true },
        receiver: { type: String, require: true },
        message: { type: String, minlength: 1, maxlength: 100},
        received: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        collection: 'message'
    }
)

MessageSchema.statics.postMessage = async function(sender, receiver, message) {

}

MessageSchema.statics.getMessgeSentTo = async function(sender, receiver) {

}

MessageSchema.statics.receiveMessage = async function(receiver) {

}

MessageSchema.statics.markMessageReceived = async function(receiver) {

}






const model = mongoose.model('MessageSchema', MessageSchema);

module.exports = model;