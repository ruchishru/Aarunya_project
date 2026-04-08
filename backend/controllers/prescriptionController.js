import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzePrescription = async (req, res) => {
    try {
        const imageFile = req.file; // From Multer middleware
        if (!imageFile) return res.json({ success: false, message: "No image uploaded" });

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        // Convert image to base64 for Gemini
        const imageData = fs.readFileSync(imageFile.path).toString("base64");

        const prompt = "Analyze this medical prescription. Extract the medicine names, dosages, and instructions. Provide a clear summary.";

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: imageData, mimeType: imageFile.mimetype } }
        ]);

        const response = await result.response;
        res.json({ success: true, analysis: response.text() });

        // Optional: Delete local temp file after processing
        fs.unlinkSync(imageFile.path);

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};