import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getDietPlan = async (req, res) => {
    try {
        const { age, gender, weight, height, activityLevel, goal, healthConditions } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Act as a professional nutritionist and medical AI advisor for the Aarunya healthcare platform.

Create a personalized diet plan for this user:
- Age: ${age}
- Gender: ${gender}
- Weight: ${weight} kg
- Height: ${height} cm
- Activity Level: ${activityLevel}
- Goal: ${goal}
- Health Conditions: ${healthConditions || "None"}

Return a clean markdown diet plan with:
1. Energy requirements
2. Macronutrient strategy
3. Daily meal plan
4. Health tips
5. Medical disclaimer
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.json({
            success: true,
            dietPlan: text
        });
    } catch (error) {
        console.error("Diet AI Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "AI recommendation failed."
        });
    }
};

export { getDietPlan };