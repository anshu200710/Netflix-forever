import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";


// ROUTES
import creatorRoutes from "./routes/creatorRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";




const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(morgan("dev"));

// Get correct __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ---------------------------------------------
// STATIC FILES: UPLOAD FOLDER
// ---------------------------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ---------------------------------------------
// DATABASE CONNECTION
// ---------------------------------------------
connectDB()

// ---------------------------------------------
// MAIN ROUTES ENTRY POINT
// ---------------------------------------------
app.get('/', (req, res)=> {
    res.send("API IS WORKING...")
})

app.use("/api/creator", creatorRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/public", publicRoutes);



app.listen(PORT , ()=> {
    console.log("Server is running on http://localhost:"+PORT)
})