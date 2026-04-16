import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import ticketModel from "../models/ticketModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for adding Doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Updated Dashboard to include Tickets
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        const tickets = await ticketModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            totalTickets: tickets.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all support tickets for Admin
// API to get all support tickets for Admin
const getAllTickets = async (req, res) => {
    try {
        console.log("--- Fetching all tickets for Admin ---");

        // .populate('userId', 'name') looks at the userId field, 
        // goes to the User collection, and brings back only the 'name'
        const tickets = await ticketModel.find({})
            .populate('userId', 'name')
            .sort({ date: -1 });

        console.log(`Success: Found ${tickets.length} tickets.`);

        return res.json({ success: true, tickets });

    } catch (error) {
        console.error("Error in getAllTickets controller:", error);
        return res.json({ success: false, message: "Failed to fetch tickets from database" });
    }
};

// API to update ticket status
const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId, status } = req.body
        const updated = await ticketModel.findByIdAndUpdate(ticketId, { status }, { new: true })

        if (!updated) return res.json({ success: false, message: "Ticket not found" })

        res.json({ success: true, message: `Status changed to ${status}` })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const adminSendMessage = async (req, res) => {
    try {
        const { ticketId, message } = req.body;
        const updatedTicket = await ticketModel.findByIdAndUpdate(
            ticketId,
            { $push: { chats: { sender: 'admin', message, timestamp: new Date() } } },
            { new: true }
        );
        res.json({ success: true, chats: updatedTicket.chats });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
// API to delete a support ticket
const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;
        const deletedTicket = await ticketModel.findByIdAndDelete(ticketId);

        if (!deletedTicket) {
            return res.json({ success: false, message: "Ticket not found" });
        }

        res.json({ success: true, message: "Ticket removed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getAdminChatHistory = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await ticketModel.findById(ticketId);
        res.json({ success: true, chats: ticket ? ticket.chats : [] });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const replyTicket = async (req, res) => {
    try {
        const { ticketId, message } = req.body;

        // 1. Add the Admin's message to the chat array
        // 2. Change status to 'Resolved'
        const updatedTicket = await ticketModel.findByIdAndUpdate(
            ticketId,
            {
                $push: { chats: { sender: 'admin', message, timestamp: new Date() } },
                status: 'Resolved'
            },
            { new: true }
        );

        if (!updatedTicket) return res.json({ success: false, message: "Ticket not found" });

        res.json({ success: true, message: "Reply sent and ticket resolved!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    updateTicketStatus,
    adminSendMessage,
    getAdminChatHistory,
    getAllTickets as allTickets,
    deleteTicket,
    replyTicket
}