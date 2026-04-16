import ticketModel from "../models/ticketModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Mock AI Logic (Fail-safe)
const getAiResponse = async (req, res) => {
    try {
        const { message } = req.body;

        // Load the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create a prompt that keeps the agent in character
        const prompt = `You are "Aarunya Support Friend," a helpful and polite assistant for a medical appointment booking platform. 
        User message: "${message}"
        Provide a concise, supportive response. If the user has a technical or payment issue, kindly suggest they "Raise a Manual Ticket" for human help.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();

        res.json({ success: true, reply });
    } catch (error) {
        console.error("Gemini Error:", error);
        // Fallback to Mock Logic if API fails (so your demo doesn't break!)
        res.json({
            success: true,
            reply: "I'm having a little trouble connecting to my brain right now, but I can still help! Please raise a manual ticket if you need urgent assistance. ✨"
        });
    }
};
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// 2. Admin: Get all tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketModel.find({}).populate('userId', 'name email');
        res.json({ success: true, tickets });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 3. Admin: Reply and Resolve
const replyTicket = async (req, res) => {
    try {
        const { ticketId, message, status } = req.body;
        const updatedTicket = await ticketModel.findByIdAndUpdate(
            ticketId,
            {
                $push: { chats: { sender: 'admin', message, timestamp: new Date() } },
                status: status || 'In Progress'
            },
            { new: true }
        );
        res.json({ success: true, message: "Reply sent successfully", ticket: updatedTicket });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 4. Admin: Delete a ticket
const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;
        await ticketModel.findByIdAndDelete(ticketId);
        res.json({ success: true, message: "Ticket deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};



const resolveTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;
        // This updates the status so the Admin knows the user is satisfied
        await ticketModel.findByIdAndUpdate(ticketId, { status: 'Resolved' });
        res.json({ success: true, message: "Chat ended and ticket resolved." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
// Add deleteTicket to your export list at the bottom
export { getAiResponse, getAllTickets, replyTicket, deleteTicket, resolveTicket };
