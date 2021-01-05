const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        sender: { type: String, required: true },
        receiver: { type: String, require: true },
        message: { type: String, minlength: 1, maxlength: 100 },
        conversationId: {type: String},
    },
    {
        timestamps: true,
        collection: 'message'
    }
)

MessageSchema.statics.postMessage = async function (sender, receiver, message, conversationId) {
    try {
        const result = await this.create({ sender, receiver, message, conversationId});
        return result;
    } catch (error) {
        throw error;
    }
}

MessageSchema.statics.getMessagesById = async function (id) {
    try{
        const result = await this.aggregate([
            {$match: {conversationId : id}},
            {$sort: {createdAt: -1}}
        ]);
        return result;
    }catch(error){
        throw error;
    }
}


const model = mongoose.model('MessageSchema', MessageSchema);

module.exports = model;