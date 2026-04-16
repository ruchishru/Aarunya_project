import { GoogleGenerativeAI } from "@google/generative-ai";

const getDietRecommendation = async (req, res) => {
    try {
        const { age, gender, weight, height, activityLevel, goal, healthConditions } = req.body;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Use gemini-1.5-flash for better stability and response speed
        const model = genAI.getGenerativeModel({ model: "Gemini-2.5-Flash" });

        const prompt = `
            Act as a professional nutritionist and medical AI advisor for the Aarunya healthcare platform. 
            Provide a detailed daily diet plan and nutritional advice for a person with the following profile:
            - Age: ${age}
            - Gender: ${gender}
            - Weight: ${weight}kg
            - Height: ${height}cm
            - Activity Level: ${activityLevel}
            - Goal: ${goal}
            - Health Conditions: ${healthConditions}

            STRICT FORMATTING RULES:
            1. Use a professional "Medical AI Report" style with Markdown.
            2. Use H1 (#) for the main title and H3 (###) for section headers.
            3. Use plenty of relevant emojis (🩺, 📊, 🥗, 🍽️, 💡, ⚡, 🚀) throughout the text.
            4. Display the Macronutrient Breakdown (Carbs, Protein, Fats) in a Markdown Table.
            5. Use **Bold text** for all key numbers, calories, and grams.
            6. Include an "AI Health Tips" section with bullet points and emojis.
            7. Add a clear Medical Disclaimer at the bottom.

            Structure the output exactly like this:
            # 🩺 AI Nutritional Analysis & Diet Roadmap
            ### 📊 1. Energy Requirements (Caloric Blueprint)
            ### 🥗 2. Macronutrient Strategy (Table)
            ### 🍽️ 3. Personalized Daily Meal Plan (Breakfast, Lunch, Snacks, Dinner)
            ### 💡 4. Essential AI Health Tips
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, dietPlan: text });

    } catch (error) {
        console.error("Diet AI Error:", error);
        res.status(500).json({
            success: false,
            message: "AI recommendation failed. Please check your API key and connection."
        });
    }
};

export { getDietRecommendation };