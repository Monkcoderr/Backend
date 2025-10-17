import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            lowecase : true,
            trim : true,
            index : true
        },
        fullname : {
            type : String,
            required : true,
            unique : true,
            lowecase : true,
            index : true
        },
        email:{
            type : String,
            required : true,
            unique : true,
            lowecase : true,
        },
        avatar : {
            type : String, // CLOUDINARY URL
            required : true ,

        },
        coverimage : {
            type : String, // CLOUDNINARY URL

        },

    watchHistory : {
             type : Schema.Types.ObjectId,
             ref : "video"
    },

        password : {
             type : String,
             required : true,
        },
        refreshToken : {

        }
    },
    {
        timestamps : true
    }
)
userSchema.pre("save" , async function(next){
    if(!this.ismodified("password")) return  next()
    this.password = await bcrypt.hash(this.password, 10)
    
} )

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}



export const User = mongoose.model("User",userSchema)