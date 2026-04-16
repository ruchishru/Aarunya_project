import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000

// Connect to Databases
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// API endpoints
// Ensure these are defined BEFORE any static file serving (if you add any later)
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

// --- DEBUGGING TOOL ---
// If a request hits a route that doesn't exist, this will log it 
// instead of sending HTML, helping you find the "undefined" or path error.
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on this server.`
  });
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))