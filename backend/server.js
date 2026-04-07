import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
// import doctorModel from "./models/doctorModel.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


// middlewares
app.use(express.json())
app.use(cors())

// const symptomMap = {
//   cardiologist: ["chest pain", "heart", "bp", "palpitation"],
//   dermatologist: ["skin", "rash", "acne", "itching"],
//   ent: ["throat", "ear", "nose", "sinus"],
//   orthopedist: ["bone", "joint", "knee", "back pain"],
//   neurologist: ["headache", "migraine", "dizziness"],
//   gynecologist: ["pregnancy", "period", "menstrual"],
//   pediatrician: ["child", "baby", "infant"]
// };

// function detectSpecialty(text) {
//   text = text.toLowerCase();
//   for (let spec in symptomMap) {
//     for (let word of symptomMap[spec]) {
//       if (text.includes(word)) return spec;
//     }
//   }
//   return "general";
// }

// app.post("/api/find-doctor", async (req, res) => {
//   try {
//     const { symptoms } = req.body;
//     const specialty = detectSpecialty(symptoms);

//     // Example: using your doctor model (adjust field names)
//     const doctors = await doctorModel.find({ specialty });

//     res.json({
//       success: true,
//       specialty,
//       doctors
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });


// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))