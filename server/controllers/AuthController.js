import  bcrypt  from "bcryptjs";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"

const maxAge = 3*24*60*60*1000;

const createToken = (email, userId) => {
    return jwt.sign({email,userId}, process.env.JWT_KEY, {expiresIn:maxAge})
}

export const signup = async (request , response, next )=>{
    try{
        const {email, password} = request.body;
        if(!email || !password){
            return response.status(400).send("Email and Password is required.")
        }

        const user = await User.create({email,password});

        response.cookie("jwt", createToken(email,user.id),{
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(201).json({user:{
            id : user.id,
            email : user.email,
            profileSetup : user.profileSetup,
        },
    })

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }
}
export const login = async (request , response, next )=>{
    try{
        const {email, password} = request.body;
        if(!email || !password){
            return response.status(400).send("Email and Password is required.")
        }

        const user = await User.findOne({email});
        if(!user){
            return response.status(400).send("User with the given email not found.")
        }
        const auth =await bcrypt.compare(password,user.password)
        if(!auth){
            return response.status(400).send("Password is incorrect.")

        }

        response.cookie("jwt", createToken(email,user.id),{
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(200).json({user:{
            id : user.id,
            email : user.email,
            profileSetup : user.profileSetup,
            firstName:user.firstName,
            lastName:user.lastName,
            image:user.iamge,
            colors:user.colors
        },
    })

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }
}
export const getUserInfo =async (request , response, next )=>{
    try{
        
       

    //     response.cookie("jwt", createToken(email,user.id),{
    //         maxAge,
    //         secure: true,
    //         sameSite: "None",
    //     });
    //     return response.status(200).json({user:{
    //         id : user.id,
    //         email : user.email,
    //         profileSetup : user.profileSetup,
    //         firstName:user.firstName,
    //         lastName:user.lastName,
    //         image:user.iamge,
    //         colors:user.colors
    //     },
    // })

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}