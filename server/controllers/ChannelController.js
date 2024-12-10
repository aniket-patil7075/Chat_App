import mongoose from "mongoose";
import Channel from "../models/ChannelModal.js";
import User from "../models/UserModel.js";
import {renameSync,unlinkSync} from "fs"


export const createChannel =async (request , response, next )=>{
    try{
        const{name,members}=request.body;
        const userId =request.userId;
        const admin=await User.findById(userId);

        if(!admin){
            return response.status(400).send("Admin user not found.")
        }
       const validMembers=await User.find({_id:{$in:members}});

       if(validMembers.length !==members.length){
        return response.status(400).send("Some members are not valid users.");
       }

       const newChannel=new Channel({
        name,
        members,
        admin:userId,
       });

       await newChannel.save();
       return response.status(201).json({channel:newChannel});
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}

export const getUserChannel =async (request , response, next )=>{
    try{
       
        const userId=new mongoose.Types.ObjectId(request.userId);

        const channels=await Channel.find({
            $or:[{admin:userId},{members:userId}],
        }).sort({updatedAt:-1});
       
       return response.status(201).json({channels});

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}


export const getChannelMessages = async (request, response, next) => {
    try {
      const {channelId} = request.params;
      const channel = await Channel.findById(channelId).populate({
        path : "messages",
        populate : {
          path : "sender",
          select : "firstName lastName email _id image color"
        },
      });
      if(!channel){
        return response.status(404).send("Channel not found")
      }
      const messages = channel.messages
      return response.status(201).json({ messages });
    } catch (error) {
      console.log({ error });
      return response.status(500).send("Internal server error");
    }
  };

//   export const addChannelImage =async (request , response, next )=>{
//     try{
//         if(!request.file){
//             return response.status(400).send("File is required.")
//         }
//       const date=Date.now();
//       let fileName="uploads/profiles/"+date + request.file.originalname;
//       renameSync(request.file.path,fileName)

//       const updatedChannel = await Channel.findByIdAndUpdate(request.channelId,
//         {image:fileName},
//         {new:true,runValidators:true}
//     )
//     console.log("Channel ID:", request.channelId);

//        return response.status(200).json({
//         image:updatedChannel.image,
//        })
//     }catch(error){
//         console.log({error})
//         return response.status(500).send("Internal server error")
//     }

// }

 // Adjust the path based on your project structure
import multer from "multer";
import path from "path";

// Set up Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists or create it dynamically
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|svg|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
}).single("channel-image"); // Field name in the request

// Add Image Controller
export const addChannelImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { chatId } = req.body;
    if (!chatId) {
      return res.status(400).json({ error: "Chat ID is required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    try {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      // Update the channel with the image URL
      const updatedChannel = await Channel.findByIdAndUpdate(
        chatId,
        { image: imageUrl },
        { new: true, runValidators: true }
      );

      if (!updatedChannel) {
        return res.status(404).json({ error: "Channel not found." });
      }

      res.status(200).json({
        message: "Image uploaded successfully.",
        image: updatedChannel.image,
      });
    } catch (error) {
      console.error("Error updating channel image:", error);
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  });
};
