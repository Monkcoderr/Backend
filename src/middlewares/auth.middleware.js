import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const authMiddleware = asynchandler(async (req, res, next) => {
    try {
        // 1. Get the token (the "pass") from the user's cookies
        // We also check 'Authorization' headers as a backup
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // 2. Check if the token exists
        if (!token) {
            throw new ApiError(401, "Unauthorized request. No token provided.");
        }

        // 3. Verify the token (Check if the "pass" is real and not expired)
        const decodedPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 4. Find the user in the database
        // We check if a user with this ID still exists
        const user = await User.findById(decodedPayload._id).select("-password");

        if (!user) {
            // The user might have been deleted, or the token is invalid
            throw new ApiError(401, "Invalid Access Token. User not found.");
        }

        // 5. ATTACH THE USER TO THE REQUEST
        // This is the most important part!
        // We are adding the user's details to the 'req' object.
        req.user = user;

        // 6. Call 'next()' to pass control to the next function (the controller)
        next();
        
    } catch (error) {
        // This will catch expired tokens, invalid signatures, etc.
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

export { authMiddleware };