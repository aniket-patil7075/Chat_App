import mongoose from 'mongoose'
const messagesSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false,
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required:true,
    },
    content:{
        type:String,
        required:function(){
            return this.messageType=="text"
        },
    },
    fileUrl:{
        type:String,
        required:function(){
            return this.messageType=="file"
        },
    },
    timestamp:{
        type:Date,
        default:Date.now,
    },
    isDeletedFor: {
        type: [mongoose.Schema.Types.ObjectId], // Array of user IDs for whom the message is deleted
        default: [],
    },
});

const Message =mongoose.model("Message",messagesSchema);

export default Message;