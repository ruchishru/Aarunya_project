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
    replyTicket
} from '../controllers/userController.js';
import { analyzePrescription } from '../controllers/prescriptionController.js';
import { getDietPlan } from '../controllers/dietController.js';
import { getAiResponse } from '../controllers/supportController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/analyze-prescription', authUser, upload.single('image'), analyzePrescription);
userRouter.post('/get-diet-plan', authUser, getDietPlan);
userRouter.post('/chat-ai', authUser, getAiResponse);

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.post('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile);

userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.get('/appointments', authUser, listAppointment);

userRouter.post('/payment-razorpay', authUser, paymentRazorpay);
userRouter.post('/verify-razorpay', authUser, verifyRazorpay);
userRouter.post('/payment-stripe', authUser, paymentStripe);
userRouter.post('/verify-stripe', authUser, verifyStripe);

userRouter.post('/create-ticket', authUser, createTicket);
userRouter.get('/my-tickets', authUser, getUserTickets);
userRouter.get('/ticket/:ticketId', authUser, getTicketById);
userRouter.get('/ticket/:ticketId/chats', authUser, getChatHistory);
userRouter.post('/ticket/:ticketId/message', authUser, sendMessage);
userRouter.post('/reply-ticket', authUser, replyTicket);

export default userRouter;