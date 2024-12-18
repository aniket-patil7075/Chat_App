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

export const uploadChannelImage = async (req, res) => {
  try {
    const { channelId } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    channel.image = req.file.path;
    await channel.save();

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: { imagePath: req.file.path },
    });
  } catch (error) {
    console.error('Error uploading channel image:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};
