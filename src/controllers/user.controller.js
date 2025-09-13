// import { asynchandler } from "../utils/asynchandler.js";
// user.controller.js
import asynchandler from "../utils/asynchandler.js";


const registerUser = asynchandler( async (req , res )=> {
    res.status(200).json({
        message : "ok"
    })
} )


export default registerUser ;