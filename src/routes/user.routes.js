import { Router } from "express";
import {loginUser, logoutUser, registerUser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    // 1st argument: Multer middleware for file handling
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage", // <-- Typo fixed
            maxCount: 1
        }
    ]),
    // 2nd argument (after the comma): The final controller to handle the logic
    registerUser
);
 
router.route("/login").post(loginUser) 

router.route("/logout").post( authMiddleware  ,logoutUser)

export default router;