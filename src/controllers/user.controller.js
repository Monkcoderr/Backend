// import { asynchandler } from "../utils/asynchandler.js";
// user.controller.js
import asynchandler from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"

const registerUser = asynchandler( async (req , res )=> {
    const {fullname, email, username, password }  = req.body
    console.log("email", email);

if (
    [fullname,email,username,password].some((field)=> field?.trim()==="")
)
    {
        throw new ApiError(400,"all fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })
   
    if (existed) {
        throw new ApiError()
    }
} )


export default registerUser ; 