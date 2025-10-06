// import { asynchandler } from "../utils/asynchandler.js";
// user.controller.js
import asynchandler from "../utils/asynchandler.js";


const registerUser = asynchandler( async (req , res )=> {
    const {fullname, email, username, password }  = req.body
    console.log("email", email);
  
} )


export default registerUser ; 