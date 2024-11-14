import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

const {genSalt,hash}=bcryptjs
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is Required."],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is Required."],
    },
    firstName:{
        type:String,
        required:false,
    },
    lastName:{
        type:String,
        required:false,
    },
    iamge:{
        type:String,
        required:false,
    },
    colors:{
        type:Number,
        required:false,
    },
    profileSetup:{
        type:Boolean,
        required:false,
    },

})

userSchema.pre("save",async function(next){
    const salt = await genSalt();
    this.password=await hash(this.password,salt);
    next();
});

const User = mongoose.model("User",userSchema);

export default User;