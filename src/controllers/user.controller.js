

// import asynchandler from "../utils/asynchandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// const registerUser = asynchandler(async (req, res) => {
//     // 1. Get data from request body
//     const { fullname, email, username, password } = req.body;
    

//     // 2. Validate all fields exist
//     if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
//         throw new ApiError(400, "All fields are required");
//     }

//     // 3. Check if user already exists
//     const existedUser = await User.findOne({
//         $or: [{ username }, { email }]
//     });

//     if (existedUser) {
//         throw new ApiError(409, "User with this email or username already exists");
//     }

//     // 4. Get local file paths from multer
//     const avatarLocalPath = req.files?.avatar[0]?.path;
//     // Line 30
// const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar file is required");
//     }

//     // 5. Upload files to Cloudinary
//     const avatar = await uploadOnCloudinary(avatarLocalPath);
//     // Conditionally upload cover image only if it exists
//     const coverImage = coverImageLocalPath 
//         ? await uploadOnCloudinary(coverImageLocalPath) 
//         : null;

//     if (!avatar) {
//         throw new ApiError(500, "Avatar upload failed, please try again");
//     }

//     // 6. Create user in the database
//     // Your pre-save hook in user.model.js will handle password hashing
//     const user = await User.create({
//         fullname,
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "", // Set to empty string if no cover image
//         username: username.toLowerCase(),
//         email: email,
//         password: password, // Pass the plain password to the model
//     });

//     // 7. Get the created user (without password) to send back
//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     );

//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registering the user");
//     }

//     // 8. Send the successful response
//     return res.status(201).json(
//         new ApiResponse(201, createdUser, "User registered successfully")
//     );
// });

// const generateAccessAndRefreshToken = async(userId) =>{
//     try {
//         const user = await User.findById(userId)
//         const accessToken =  user.generateAccessToken()
//         const refreshToken =  user.generateRefreshToken()

//         user.refreshToken = refreshToken
//       await  user.save({validateBeforeSave : false})
//         return {accessToken , refreshToken}

//     } catch (error) {
//         throw new ApiError(500,"something went wrong while generating refresh and access token")
//     }
// }





// const loginUser = asynchandler( async (req ,res) => {

//     const {username , email , password} = req.body;

//     if(!username && !email){
//         throw new ApiError(400, "username or eamil is required")
//     }
   
//      const user = await User.findOne({
//         $or : [{username}, {email}]
//     })

//     if (!user) {
//         throw new ApiError(404,"user not found")
//     }

//     const isPasswordValid =  await user.isPasswordCorrect(password)

//     if (!isPasswordValid) {
//         throw new ApiError(400,"Invalid User Credentials")
//     }

//  const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
// // We create options for our cookie
// const options = {
//     httpOnly: true,
//     secure: true
// };

// return res
//     .status(200)
//     .cookie("accessToken", accessToken, options) // ⬅️ Send the access token as a cookie
//     .cookie("refreshToken", refreshToken, options) // ⬅️ Send the refresh token as a cookie
//     .json(
//         new ApiResponse(
//             200,
//             {
                
//             },
//             "User logged in successfully"
//         )
//     );

// })


// const logoutUser = asynchandler(async(req, res)=>{
//      await User.findByIdAndUpdate(
//         req.user._id,
//         {
//             $set : {
//                 refreshToken : undefined
//             }
//         },
//         {
//             new : true
//         }
         
//      )
//      const options = {
//     httpOnly: true,
//     secure: true
// };
// return res
//     .status(200)
//     .clearCookie("accessToken", options) // ✅ FIXED
//     .clearCookie("refreshToken", options) // ✅ FIXED
//     .json(
//         new ApiResponse(
//             200,
//             {},
//             "User logged OUT in successfully"
//         )
//     );

// })






// export {registerUser,
//     loginUser,
//     logoutUser
// } ;




import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"; // Make sure jwt is imported

//
// --- YOUR EXISTING REGISTER FUNCTION (Corrected) ---
//
const registerUser = asynchandler(async (req, res) => {
    // 1. Get data from request body
    const { fullname, email, username, password } = req.body;
    
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
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // 5. Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath 
        ? await uploadOnCloudinary(coverImageLocalPath) 
        : null;

    if (!avatar) {
        throw new ApiError(500, "Avatar upload failed, please try again");
    }

    // 6. Create user in the database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", 
        username: username.toLowerCase(),
        email: email,
        password: password, 
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

//
// --- YOUR TOKEN HELPER FUNCTION (This is crucial) ---
//
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken; // This saves the new token
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

//
// --- YOUR EXISTING LOGIN FUNCTION (Bug Fixed) ---
//
const loginUser = asynchandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or eamil is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials"); // 401 is better
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
    // --- THIS IS THE BUG FIX ---
    // Create a version of the user object to send to the frontend, without sensitive info.
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options) 
        .cookie("refreshToken", refreshToken, options) 
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, // Use the 'loggedInUser' variable
                    accessToken, // It's good practice to send the access token in the JSON as well
                    refreshToken // Send the refresh token in the JSON (optional, but good for mobile apps)
                },
                "User logged in successfully"
            )
        );
});

//
// --- YOUR EXISTING LOGOUT FUNCTION (Bug Fixed) ---
//
const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, // This comes from the 'authMiddleware'
        {
            $set: {
                refreshToken: undefined // This revokes the token
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    // --- THIS IS THE BUG FIX ---
    // clearCookie just needs the name of the cookie, not the variable
    return res
        .status(200)
        .clearCookie("accessToken", options) // Fixed
        .clearCookie("refreshToken", options) // Fixed
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});

//
// --- *** ADD THIS NEW FUNCTION *** ---
//
const refreshAccessToken = asynchandler(async (req, res) => {
    // 1. Get the refresh token from the user's cookie
    const incomingRefreshToken = req.cookies.refreshToken;

    // 2. Check if the token exists
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized: No refresh token provided");
    }

    try {
        // 3. Verify the token (Is the signature valid? Is it expired?)
        const decodedPayload = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // 4. Find the user in the database
        const user = await User.findById(decodedPayload._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token: User not found");
        }

        // 5. CRITICAL: Check if the token from the cookie matches the token in our database
        // This ensures the token hasn't been revoked (e.g., by a logout)
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or has been revoked");
        }

        // 6. If we're here, the token is valid. Generate a new pair.
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        // 7. Send the new tokens back to the user
        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access token refreshed successfully"
                )
            );

    } catch (error) {
        // This will catch expired tokens or invalid signatures
        throw new ApiError(401,  "Invalid refresh token");
    }
});


// --- Export all your functions ---
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken // ⬅️ Add the new function here
};