import {  Server as SocketIoServer}from "socket.io"
// import Message from "./models/messagesModel.js";
import Message from "./models/messagesModel.js";
import Channel from "./models/ChannelModal.js";
const setupSocket=(server)=>{
    const io= new SocketIoServer(server,{
        cors:{
            origin:process.env.ORIGIN,
            methods:["GET","POST"],
            credentials:true,
        },
    });

    const userSocketMap =new Map();

    const disconnect=(socket)=>{
        console.log(`Client Disconnected : ${socket.id}`);
        for(const[userId,socketId] of userSocketMap.entries()){
            if(socketId===socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
        
    };

    const deleteMessage = async (messageId) => {
        try {
          const message = await Message.findById(messageId);
    
          if (!message) {
            console.error("Message not found for deletion.");
            return;
          }
    
          await Message.findByIdAndDelete(messageId);
    
          if (message.recipient) {
            const senderSocketId = userSocketMap.get(message.sender.toString());
            const recipientSocketId = userSocketMap.get(message.recipient.toString());
    
            if (senderSocketId) {
              io.to(senderSocketId).emit("messageDeleted", messageId);
            }
            if (recipientSocketId) {
              io.to(recipientSocketId).emit("messageDeleted", messageId);
            }
          } else if (message.channelId) {
            const channel = await Channel.findById(message.channelId).populate("members");
    
            if (channel && channel.members) {
              channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                  io.to(memberSocketId).emit("channelMessageDeleted", messageId);
                }
              });
            }
          }
        } catch (error) {
          console.error("Error deleting message:", error);
        }
      };

    const sendMessage=async (message)=>{
        const sendScoketId=userSocketMap.get(message.sender);
        const recipientSocketId=userSocketMap.get(message.recipient);

        const createdMessage=await Message.create(message);

        const messageData=await Message.findById(createdMessage._id)
        .populate("sender","id email firstName lastName image color")
        .populate("recipient","id email firstName lastName image color");

        if(recipientSocketId){
            io.to(recipientSocketId).emit("reciveMessage",messageData);
        }
        if(sendScoketId){
            io.to(sendScoketId).emit("reciveMessage",messageData);

        }
    }

    const sendChannelMessage=async (message)=>{
        const {channelId,sender,content,messageType,fileUrl} =message;

        const createdMessage=await Message.create({
            sender,
            recipient:null,
            content,
            messageType,
            timestamp:new Date(),
            fileUrl,
        });
        const messageData=await Message.findById(createdMessage._id)
        .populate("sender","id email firstName lastName image color")
        .exec();

        await Channel.findByIdAndUpdate(channelId,{
            $push:{messages:createdMessage._id},
        });
        const channel=await Channel.findById(channelId).populate("members");

        const finalData = {...messageData._doc,channelId:channel._id};

        if(channel && channel.members){
            channel.members.forEach((member)=>{
                const memberSocketId=userSocketMap.get(member._id.toString());

                if(memberSocketId){
                    io.to(memberSocketId).emit("recieve-channel-message",finalData);
                }
                
            });
            const adminSocketId=userSocketMap.get(channel.admin._id.toString());
                if(adminSocketId){
                    io.to(adminSocketId).emit("recieve-channel-message",finalData);
                }
        }

    };
    
    io.on("connection",(socket)=>{
        const userId= socket.handshake.query.userId;

        if(userId){
            userSocketMap.set(userId,socket.id);
            console.log(`User connected: ${userId} with socket ID : ${socket.id}`);
            
        }
        else{
            console.log("User id is not provided during connection")
        }
        socket.on("deleteMessage", async (messageId) => {
          await deleteMessage(messageId);
      });
        socket.on("sendMessage",sendMessage)
        socket.on("send-channel-message",sendChannelMessage)
        socket.on("disconnect",()=>disconnect(socket))
    })

    
}
export default setupSocket;