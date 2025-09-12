import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs";
import path from 'path';

 // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NMAE, 
        api_key:  process.env.CLOUDINARY_API_KEY, 
        api_secret:  process.env.CLOUDINARY_API_SECRET 
    });


    const uploadOnCloudniary = async (localFilePath)=>{
        try {
            if(!localFilePath) return null 
                
            // upload file on cloudniary

          const response = await  cloudinary.uploader.upload(localFilePath,{
                resource_type : 'auto'
            
            })
            console.log("file upload succesfully", response.url)
            
        } catch (error) {
           fs.unlinkSync(localFilePath)
           return null
        }
    }
    export {uploadOnCloudniary}