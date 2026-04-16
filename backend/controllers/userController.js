import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import ticketModel from "../models/ticketModel.js";
import { v2 as cloudinary } from 'cloudinary';
import stripe from "stripe";
import razorpay from 'razorpay';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const frustrateKeywords = ['payment failed', 'stuck', 'error', 'wrong', 'not working', 'emergency', 'urgent', 'cancel', 'refund'];
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// User Authentication
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.json({ success: false, message: 'Missing Details' })
        if (!validator.isEmail(email)) return res.json({ success: false, message: "Please enter a valid email" })
        if (password.length < 8) return res.json({ success: false, message: "Please enter a strong password" })
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new userModel({ name, email, password: hashedPassword })
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) return res.json({ success: false, message: "User does not exist" })
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Profile Management
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file
        if (!name || !phone || !dob || !gender) return res.json({ success: false, message: "Data Missing" })
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            await userModel.findByIdAndUpdate(userId, { image: imageUpload.secure_url })
        }
        res.json({ success: true, message: 'Profile Updated' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Appointment Logic
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")
        if (!docData.available) return res.json({ success: false, message: 'Doctor Not Available' })
        let slots_booked = docData.slots_booked
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) return res.json({ success: false, message: 'Slot Not Available' })
            else slots_booked[slotDate].push(slotTime)
        } else {
            slots_booked[slotDate] = [slotTime]
        }
        const userData = await userModel.findById(userId).select("-password")
        delete docData.slots_booked
        const appointmentData = { userId, docId, userData, docData, amount: docData.fees, slotTime, slotDate, date: Date.now() }
        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment Booked' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId }).populate('docId');
        const formatted = appointments.map(item => {
            const app = item.toObject();
            app.docData = app.docId;
            return app;
        });
        res.json({ success: true, appointments: formatted });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData.userId.toString() !== userId) return res.json({ success: false, message: 'Unauthorized action' })

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Ticket / Support Logic
const createTicket = async (req, res) => {
    try {
        const { userId, issueType, description } = req.body;
        if (!issueType || !description) return res.json({ success: false, message: "Missing Details" });
        let priority = 'Medium';
        if (frustrateKeywords.some(word => description.toLowerCase().includes(word))) priority = 'High';

        const newTicket = new ticketModel({ userId, issueType, description, priority, status: 'Open', chats: [] });
        await newTicket.save();
        res.json({ success: true, message: "Ticket created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getUserTickets = async (req, res) => {
    try {
        const { userId } = req.body;
        const tickets = await ticketModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, tickets });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.body.userId || req.user?.id;
        const ticket = await ticketModel.findOne({ _id: ticketId, userId });
        if (!ticket) return res.json({ success: false, message: "Ticket not found" });
        res.json({ success: true, ticket });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.body.userId || req.user?.id;
        const ticket = await ticketModel.findOne({ _id: ticketId, userId });
        if (!ticket) return res.json({ success: false, message: "Ticket not found" });
        res.json({ success: true, chats: ticket.chats || [] });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// FIXED: AI Support Agent Logic
const sendMessage = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message, userId } = req.body;

        // 1. Save user's message
        const ticket = await ticketModel.findOneAndUpdate(
            { _id: ticketId, userId },
            { $push: { chats: { sender: 'user', message, timestamp: new Date() } } },
            { new: true }
        );

        if (!ticket) return res.json({ success: false, message: "Ticket not found" });

        // 2. AI logic with fixed model reference
        try {
            // Updated model string to avoid "Not Found" error
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent(`You are an Aarunya support assistant. User says: ${message}`);
            const aiResponse = result.response.text();

            // 3. Save AI response
            const updatedTicket = await ticketModel.findByIdAndUpdate(
                ticketId,
                { $push: { chats: { sender: 'ai', message: aiResponse, timestamp: new Date() } } },
                { new: true }
            );

            res.json({ success: true, chats: updatedTicket.chats });
        } catch (aiErr) {
            console.error("AI Error:", aiErr);
            res.json({ success: true, chats: ticket.chats, message: "AI Busy, agent will reply." });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const replyTicket = async (req, res) => {
    try {
        const { ticketId, message, status } = req.body;
        const updatedTicket = await ticketModel.findByIdAndUpdate(
            ticketId,
            { $push: { chats: { sender: 'admin', message, timestamp: new Date() } }, status: status || 'In Progress' },
            { new: true }
        );
        res.json({ success: true, message: "Reply sent", ticket: updatedTicket });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Payment Gateways
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        const options = { amount: appointmentData.amount * 100, currency: process.env.CURRENCY || 'INR', receipt: appointmentId };
        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else res.json({ success: false });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { origin } = req.headers;
        const appointmentData = await appointmentModel.findById(appointmentId);
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: [{ price_data: { currency: 'inr', product_data: { name: "Fees" }, unit_amount: appointmentData.amount * 100 }, quantity: 1 }],
            mode: 'payment',
        });
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const verifyStripe = async (req, res) => {
    try {
        const { appointmentId, success } = req.body;
        if (success === "true") await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
        res.json({ success: success === "true" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// FIXED: AI Chat logic
const chatAI = async (req, res) => {
    try {
        const { message } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        // ✅ NEW PROMPT (this fixes paragraph issue)
        const prompt = `
You are Aarunya Healthcare Support AI.

Rules:
- Reply in SHORT bullet points only
- Maximum 3-4 lines
- No long paragraphs
- Be clear and helpful
- Sound like a support assistant

User Query: ${message}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, reply: text });

    } catch (error) {
        console.log("AI Error Details:", error);
        res.json({ success: false, message: "Support AI is temporarily unavailable." });
    }
};
export {
    loginUser, registerUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment,
    paymentRazorpay, verifyRazorpay, paymentStripe, verifyStripe,
    createTicket, getUserTickets, getTicketById, getChatHistory, sendMessage, replyTicket, chatAI
}