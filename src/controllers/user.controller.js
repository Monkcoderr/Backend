// import { asynchandler } from "../utils/asynchandler.js";
// user.controller.js
import asynchandler from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";




const registerUser = asynchandler( async (req , res )=> {
    const {fullname, email, username, password }  = req.body
    console.log("email", email);

if (
    [fullname,email,username,password].some((field)=> field?.trim()==="")
)
    {
        throw new ApiError(400,"all fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
   
    if (existedUser) {
        throw new ApiError()
    }

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath  = req.files?.coverImage[0]?.path;

if (!avatarLocalPath){
    throw new ApiError(400, "avatar file is rerquired")
}
  
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if (!avatar){
    throw new ApiError(400,"Avatar is missing")
}

const user = await User.create({
    fullname,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    username : username.toLowerCase()
}) 

const createdUser = await User.findById(user.id).select(
    "-pasword -refreshToken"
)

if(!createdUser){
    throw new ApiError(500, "something went wrong while registering user")
}
return res.status(201).json(
    new ApiResponse(200,createdUser,"user regigster susserfully")
)

} )


export default registerUser ; 