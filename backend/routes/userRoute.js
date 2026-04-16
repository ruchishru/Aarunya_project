import express from 'express';
import {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
    createTicket,
    getUserTickets,
    getTicketById,
    getChatHistory,
    sendMessage,
    replyTicket,
    chatAI
} from '../controllers/userController.js';
import { analyzePrescription } from '../controllers/prescriptionController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

// Prescription route
userRouter.post('/analyze-prescription', authUser, upload.single('image'), analyzePrescription);

// Auth routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Profile routes
userRouter.post('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile);

// Appointment routes
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.get('/appointments', authUser, listAppointment);

// Payment routes
userRouter.post('/payment-razorpay', authUser, paymentRazorpay);
userRouter.post('/verify-razorpay', authUser, verifyRazorpay);
userRouter.post('/payment-stripe', authUser, paymentStripe);
userRouter.post('/verify-stripe', authUser, verifyStripe);

// Ticket routes
userRouter.post('/create-ticket', authUser, createTicket);
userRouter.get('/my-tickets', authUser, getUserTickets);
userRouter.get('/ticket/:ticketId', authUser, getTicketById);
userRouter.get('/ticket/:ticketId/chats', authUser, getChatHistory);
userRouter.post('/ticket/:ticketId/message', authUser, sendMessage);
userRouter.post('/chat-ai', authUser, chatAI);
userRouter.post('/reply-ticket', authUser, replyTicket);

export default userRouter;