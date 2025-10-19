// import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// ✅ CONFIGURE DOTENV FIRST!
// dotenv.config({
//   path: './.env' 
// });

// Now that process.env is populated, you can connect to the DB and start the app.
connectDB()
.then(() => {
    // Note: It's conventional for PORT to be uppercase in .env files
    app.listen(process.env.PORT || 8000, () => { 
        console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
});
