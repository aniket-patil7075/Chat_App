import { ImOffice } from "react-icons/im";
import Message from "../models/messagesModel.js"
import {mkdirSync, renameSync} from 'fs'
export const getMessages =async (request , response, next )=>{
    try{
       
        const user1=request.userId;
        const user2=request.body.id;

        if(!user1  || !user2){
            return response.status(400).send("Both user ID's required.")
        }
         const messages =await Message.find({
            $or:[
                {sender:user1,recipient:user2},
                {sender:user2,recipient:user1},
            ],
            isDeletedFor: { $ne: user1 }
         }).sort({timestamp:1})

       return response.status(200).json({messages});

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}

export const uploadFile =async (request , response, next )=>{
    try{
       
       if(!request.file){
        return response.status(400).send("File is required.")
       }

       const date=Date.now();
       let fileDir=`uploads/files/${date}`
       let fileName = `${fileDir}/${request.file.originalname}`;
       mkdirSync(fileDir,{recursive:true});

       renameSync(request.file.path,fileName)
       
       return response.status(200).json({filePath:fileName});

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}

export const deleteChatMessages = async (req, res, next) => {
  console.log("Request body:", req.body);

  const { id } = req.params; // chatId (sender)
  const { userId, recepientId } = req.body;

  if (!userId || !recepientId) {
    return res.status(400).json({ error: "User ID and Recipient ID are required." });
  }

  try {
    // Fetch messages where either the sender is the user and the recipient is the other user,
    // or the sender is the other user and the recipient is the user.
    const messages = await Message.find({
      $or: [
        { sender: id, recipient: recepientId },  // Sender is user, recipient is the other user
        { sender: recepientId, recipient: id },  // Sender is the other user, recipient is user
      ],
    });

    // Check if no messages were found
    if (messages.length === 0) {
      return res.status(404).json({ error: "No messages found between the specified users." });
    }

    // Mark all messages as deleted only for the sender (userId)
    await Promise.all(
      messages.map(async (message) => {
        // Mark as deleted for the sender only, if not already done
        if (!message.isDeletedFor.includes(userId)) {
          message.isDeletedFor.push(userId); // Mark as deleted for the user (sender)
          await message.save();
        }
      })
    );

    res.status(200).json({ message: "All chat messages cleared for the sender." });
  } catch (error) {
    console.error("Error clearing all chat messages:", error);
    res.status(500).json({ error: "An error occurred while clearing the chat." });
  }
};

  

  export const deleteMessage = async (req, res) => {
    try {
      const { messageId } = req.body;
  
      if (!messageId) {
        return res.status(400).json({ success: false, message: "Message ID is required." });
      }
  
      const deletedMessage = await Message.findByIdAndDelete(messageId);
  
      if (!deletedMessage) {
        return res.status(404).json({ success: false, message: "Message not found." });
      }
  
      res.status(200).json({ success: true, message: "Message deleted successfully." });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ success: false, message: "Failed to delete message." });
    }
  };


  export const deleteMessageForUser = async (req, res) => {
    console.log("Request body:", req.body); 

    const { id } = req.params; 
    const { userId } = req.body; 

    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ error: "Message not found." });
        }

        
        if (!message.isDeletedFor.includes(userId)) {
            message.isDeletedFor.push(userId);
            await message.save();
        }

        res.status(200).json({ message: "Message marked as deleted for the user." });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the message." });
    }
};

export const deleteForEveryone = async (req, res) => {
  const { messageId } = req.body;
  console.log("Delete for everyone called..", req.body);
  
  
try {
  // Mark message as deleted
  const message = await Message.findByIdAndUpdate(
    messageId,
    { content: "Delete for everyone", deleted: true },
    { new: true } // Return the updated message
  );

  if (!message) {
    return res.status(404).json({ success: false, message: "Message not found" });
  }

  

  res.json({ success: true, message: "Message deleted successfully" });
} catch (error) {
  console.error("Error deleting message:", error);
  res.status(500).json({ success: false, message: "Failed to delete the message" });
}
};