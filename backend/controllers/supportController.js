import ticketModel from "../models/ticketModel.js";
import doctorModel from "../models/doctorModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const supportKeywords = [
    "payment",
    "refund",
    "error",
    "bug",
    "not working",
    "failed",
    "login",
    "issue",
    "transaction",

    "book appointment",
    "book my appointment",
    "how to book",
    "appointment booking",
    "booking help",
    "booking issue",
    "appointment not booked",

    "cancel booking",
    "cancel appointment",
    "cancel my appointment",
    "cancel my booking",

    "reschedule appointment",
    "reschedule booking",
    "reschedule my appointment",

    "payment status",
    "manual ticket",
    "talk to human",
    "support",
    "website problem"
];

const emergencyKeywords = [
    "chest pain",
    "difficulty breathing",
    "breathing problem",
    "can't breathe",
    "can’t breathe",
    "severe bleeding",
    "unconscious",
    "seizure",
    "stroke",
    "heart attack",
    "suicidal",
    "fainted"
];

const symptomToSpecialistMap = {
    headache: "Neurologist",
    migraine: "Neurologist",
    dizziness: "Neurologist",

    skin: "Dermatologist",
    rash: "Dermatologist",
    acne: "Dermatologist",
    itching: "Dermatologist",
    allergy: "Dermatologist",

    fever: "General Physician",
    cold: "General Physician",
    cough: "General Physician",
    weakness: "General Physician",
    vomiting: "General Physician",

    chest: "Cardiologist",
    heart: "Cardiologist",
    palpitation: "Cardiologist",

    stomach: "Gastroenterologist",
    acidity: "Gastroenterologist",
    constipation: "Gastroenterologist",
    "abdominal pain": "Gastroenterologist",

    eye: "Ophthalmologist",
    vision: "Ophthalmologist",

    ear: "ENT Specialist",
    nose: "ENT Specialist",
    throat: "ENT Specialist",
    sinus: "ENT Specialist",

    periods: "Gynecologist",
    menstrual: "Gynecologist",
    pregnancy: "Gynecologist",

    "back pain": "Orthopedic",
    "knee pain": "Orthopedic",
    joint: "Orthopedic",
    bone: "Orthopedic",

    anxiety: "Psychiatrist",
    stress: "Psychiatrist",
    depression: "Psychiatrist",
    sleep: "Psychiatrist"
};

const detectEmergency = (text = "") => {
    const lower = text.toLowerCase();
    return emergencyKeywords.some((word) => lower.includes(word));
};

const detectSupportIntent = (text = "") => {
    const lower = text.toLowerCase();

    // direct keyword matching
    if (supportKeywords.some((word) => lower.includes(word))) {
        return true;
    }

    // booking intent
    if (
        lower.includes("book") &&
        (lower.includes("appointment") || lower.includes("booking"))
    ) {
        return true;
    }

    if (
        lower.includes("how") &&
        lower.includes("book") &&
        (lower.includes("appointment") || lower.includes("doctor"))
    ) {
        return true;
    }

    // cancel intent
    if (
        lower.includes("cancel") &&
        (lower.includes("appointment") || lower.includes("booking"))
    ) {
        return true;
    }

    // reschedule intent
    if (
        lower.includes("reschedule") &&
        (lower.includes("appointment") || lower.includes("booking"))
    ) {
        return true;
    }

    // payment / refund intent
    if (
        lower.includes("payment") ||
        lower.includes("refund") ||
        lower.includes("transaction")
    ) {
        return true;
    }

    // account / login intent
    if (
        lower.includes("login") ||
        lower.includes("account")
    ) {
        return true;
    }

    // human support intent
    if (
        lower.includes("ticket") ||
        lower.includes("human support") ||
        lower.includes("talk to human") ||
        lower.includes("support")
    ) {
        return true;
    }

    return false;
};

const getFallbackSpecialist = (text = "") => {
    const lower = text.toLowerCase();

    for (const keyword in symptomToSpecialistMap) {
        if (lower.includes(keyword)) {
            return symptomToSpecialistMap[keyword];
        }
    }

    return "General Physician";
};

// 1. Smart AI Help Desk
const getAiResponse = async (req, res) => {
    const userMessage = req.body?.message?.trim() || "";

    try {
        if (!userMessage) {
            return res.json({
                success: false,
                message: "Please enter your query."
            });
        }

        // 1) Emergency flow
        if (detectEmergency(userMessage)) {
            return res.json({
                success: true,
                type: "emergency",
                reply: {
                    title: "Emergency Alert",
                    summary: "This may require urgent medical attention.",
                    possibleIssue: "The symptoms you mentioned could be serious.",
                    specialist: "Emergency Care",
                    advice: [
                        "Please seek immediate medical help.",
                        "Visit the nearest hospital or call emergency services.",
                        "Do not depend only on AI advice in emergencies."
                    ]
                },
                doctors: []
            });
        }

        // 2) Support / booking / payment flow
        if (detectSupportIntent(userMessage)) {
            return res.json({
                success: true,
                type: "technical",
                reply: {
                    title: "Support Guidance",
                    summary: "This looks like a booking, payment, or platform support request.",
                    possibleIssue: "This is a service/support query, not a medical symptom query.",
                    specialist: "Support Team",
                    advice: [
                        "For booking, go to All Doctors and choose a doctor profile.",
                        "Then select a slot and confirm your appointment.",
                        "If booking fails, please raise a Manual Ticket for support."
                    ]
                },
                doctors: []
            });
        }

        // 3) Medical flow
        let aiData;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `
You are Aarunya AI Help Desk, a healthcare support assistant.

User message:
"${userMessage}"

Return ONLY valid JSON. No markdown. No extra explanation.

Format:
{
  "summary": "...",
  "possibleIssue": "...",
  "specialist": "...",
  "advice": ["...", "...", "..."]
}

Rules:
- Keep it short, practical, and user-friendly
- This is NOT a final diagnosis
- specialist must be one of:
  "General Physician", "Dermatologist", "Neurologist", "Cardiologist",
  "Gastroenterologist", "Gynecologist", "Orthopedic", "Psychiatrist",
  "ENT Specialist", "Ophthalmologist"
- If unsure, choose "General Physician"
- Advice should be 3 short bullet-style points
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const rawText = response.text().trim();

            try {
                aiData = JSON.parse(rawText);
            } catch {
                aiData = {
                    summary: "I understood your concern and found a likely next step.",
                    possibleIssue: "A proper consultation may help understand the issue better.",
                    specialist: getFallbackSpecialist(userMessage),
                    advice: [
                        "Monitor your symptoms carefully.",
                        "Stay hydrated and get enough rest.",
                        "Consult a doctor if symptoms continue or worsen."
                    ]
                };
            }
        } catch (aiError) {
            console.error("Medical AI section failed:", aiError?.message || aiError);

            aiData = {
                summary: "I could not fully process your query right now, but I can still guide you.",
                possibleIssue: "Your symptoms may need medical consultation.",
                specialist: getFallbackSpecialist(userMessage),
                advice: [
                    "Monitor your symptoms carefully.",
                    "Stay hydrated and rest well.",
                    "Consult the recommended doctor if symptoms continue or worsen."
                ]
            };
        }

        const specialist = aiData.specialist || getFallbackSpecialist(userMessage);

        let doctors = [];
        try {
            doctors = await doctorModel
                .find({
                    speciality: { $regex: new RegExp(`^${specialist}$`, "i") },
                    available: true
                })
                .select("-password")
                .limit(5);
        } catch (doctorError) {
            console.error("Doctor lookup failed:", doctorError?.message || doctorError);
            doctors = [];
        }

        return res.json({
            success: true,
            type: "medical",
            reply: {
                title: "AI Health Guidance",
                summary: aiData.summary,
                possibleIssue: aiData.possibleIssue,
                specialist,
                advice: Array.isArray(aiData.advice)
                    ? aiData.advice
                    : [
                        "Monitor your symptoms carefully.",
                        "Stay hydrated and get enough rest.",
                        "Consult a doctor if symptoms continue or worsen."
                    ]
            },
            doctors
        });
    } catch (error) {
        console.error("Help Desk AI Error:", error?.message || error);

        const fallbackSpecialist = getFallbackSpecialist(userMessage);

        return res.json({
            success: true,
            type: "fallback",
            reply: {
                title: "AI Guidance Fallback",
                summary: "I could not fully process your query right now, but I can still guide you.",
                possibleIssue: "Your symptoms may need medical consultation.",
                specialist: fallbackSpecialist,
                advice: [
                    "Monitor your symptoms carefully.",
                    "Stay hydrated and rest well.",
                    "Consult the recommended doctor if symptoms continue or worsen."
                ]
            },
            doctors: []
        });
    }
};

// 2. Admin: Get all tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketModel
            .find({})
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        return res.json({ success: true, tickets });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// 3. Admin: Reply and update ticket status
const replyTicket = async (req, res) => {
    try {
        const { ticketId, message, status } = req.body;

        const updatedTicket = await ticketModel.findByIdAndUpdate(
            ticketId,
            {
                $push: {
                    chats: {
                        sender: "admin",
                        message,
                        timestamp: new Date()
                    }
                },
                status: status || "In Progress"
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Reply sent successfully",
            ticket: updatedTicket
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// 4. Admin: Delete a ticket
const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;

        await ticketModel.findByIdAndDelete(ticketId);

        return res.json({
            success: true,
            message: "Ticket deleted successfully"
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// 5. Resolve ticket
const resolveTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;

        await ticketModel.findByIdAndUpdate(ticketId, {
            status: "Resolved"
        });

        return res.json({
            success: true,
            message: "Chat ended and ticket resolved."
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export { getAiResponse, getAllTickets, replyTicket, deleteTicket, resolveTicket };