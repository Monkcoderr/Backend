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
    }
)



export const Sample = mongoose.model(Sample, sampleSchema)