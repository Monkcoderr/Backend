

import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynchandler(async (req, res) => {
    // 1. Get data from request body
    const { fullname, email, username, password } = req.body;
    console.log("email", email);

    // 2. Validate all fields exist
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // 4. Get local file paths from multer
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // Line 30
const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // 5. Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // Conditionally upload cover image only if it exists
    const coverImage = coverImageLocalPath 
        ? await uploadOnCloudinary(coverImageLocalPath) 
        : null;

    if (!avatar) {
        throw new ApiError(500, "Avatar upload failed, please try again");
    }

    // 6. Create user in the database
    // Your pre-save hook in user.model.js will handle password hashing
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // Set to empty string if no cover image
        username: username.toLowerCase(),
        email: email,
        password: password, // Pass the plain password to the model
    });

    // 7. Get the created user (without password) to send back
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 8. Send the successful response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken =  user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        user.refreshToken = refreshToken
      await  user.save({validateBeforeSave : false})
        return {accessToken , refreshToken}

    } catch (error) {
        throw new ApiError(500,"something went wrong while generating refresh and access token")
    }
}





const loginUser = asynchandler( async (req ,res) => {

    const {username , email , password} = req.body;

    if(!username || !email){
        throw new ApiError(400, "username or eamil is required")
    }
   
     const user = await User.findOne({
        $or : [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404,"user not found")
    }

    const isPasswordValid =  await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400,"Invalid User Credentials")
    }

 const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
// We create options for our cookie
const options = {
    httpOnly: true,
    secure: true
};

return res
    .status(200)
    .cookie("accessToken", accessToken, options) // ⬅️ Send the access token as a cookie
    .cookie("refreshToken", refreshToken, options) // ⬅️ Send the refresh token as a cookie
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
            },
            "User logged in successfully"
        )
    );

})



export {registerUser,
    loginUser
} ;