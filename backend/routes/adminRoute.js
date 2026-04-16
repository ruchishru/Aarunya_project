import express from 'express';
import {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
} from '../controllers/adminController.js';

// Import the support-specific functions
import {
    getAllTickets,
    replyTicket, // Check: Ensure this matches the name exported in supportController.js
    deleteTicket
} from '../controllers/supportController.js';

import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();

// --- ADMIN AUTH & MANAGEMENT ---
adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

// --- SUPPORT TICKET ADMIN ROUTES ---

// 1. Fetch all tickets
adminRouter.get('/all-tickets', authAdmin, getAllTickets);

// 2. Reply & Resolve (FIXED: Changed replyToTicket to replyTicket to match import)
adminRouter.post('/reply-ticket', authAdmin, replyTicket);

// 3. Delete Ticket
adminRouter.post('/delete-ticket', authAdmin, deleteTicket);

export default adminRouter;