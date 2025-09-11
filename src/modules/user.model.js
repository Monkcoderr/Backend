import mongoose , {Schema} from "mongoose";
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

        },
        coverimage : {

        },
        password : {

        },
        refreshToken : {

        }
    },
    {
        timestamps : true
    }
)





export const User = mongoose.model("User,userSchema")