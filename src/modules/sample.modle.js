import mongoose from "mongoose";

const sampleSchema = new mongoose.Schema(
    {
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
            type : string, // CLOUDINARY URL
            required : true ,

        },
        coverimage : {
            type : string, // CLOUDNINARY URL

        },

    watchHistory : {
             type : Schema.Types.ObjectId,
             ref : "video"
    },

        password : {
             type : string,
             required : true,
        },
        refreshToken : {

        }
    }
)



export const Sample = mongoose.model(Sample, sampleSchema)