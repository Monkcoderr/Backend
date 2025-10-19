

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration (with typo fixed)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME,  // matches your .env
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
            
        // Upload file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // File has been uploaded successfully
        console.log("File uploaded successfully:", response.url);
        
        // FIX 2: Remove the local file after a successful upload
        // fs.unlinkSync(localFilePath); 
        
        return response;

    } catch (error) {
        // FIX 3: Log the error to see what went wrong
        console.error("Error during Cloudinary upload:", error);

        // Remove the locally saved temporary file as the upload operation failed
        fs.unlinkSync(localFilePath); 
        
        return null;
    }
}

// Corrected function name in export
export { uploadOnCloudinary };



// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs";

// // --- START OF DIAGNOSTIC LOGS ---
// console.log("--- Cloudinary Config Check ---");
// console.log("Cloud Name:", process.env.CLOUDINARY_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Exists" : "MISSING or empty");
// console.log("-----------------------------");
// // --- END OF DIAGNOSTIC LOGS ---

// // Configuration
// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET 
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;
        
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: 'auto'
//         });

//         fs.unlinkSync(localFilePath); 
//         return response;

//     } catch (error) {
//         console.error("Error during Cloudinary upload:", error.message);
        
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
        
//         return null;
//     }
// }

// export { uploadOnCloudinary };