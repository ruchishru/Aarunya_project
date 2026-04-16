import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SupportContext = createContext();
export const useSupport = () => useContext(SupportContext);

export const SupportProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('support');

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const fetchUserTickets = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/user/my-tickets`, { headers: { token } });
            if (response.data.success) {
                setTickets(response.data.tickets || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tickets');
        } finally { setLoading(false); }
    };

    const createTicket = async (issueType, description) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { toast.error("Please login first"); return false; }

            const { data } = await axios.post(
                `${backendUrl}/api/user/create-ticket`,
                { issueType, description },
                { headers: { token } }
            );

            if (data.success) {
                fetchUserTickets();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // ADDED: Missing sendMessage function
    const sendMessage = async (ticketId, message) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${backendUrl}/api/user/ticket/${ticketId}/message`,
                { message, mode },
                { headers: { token } }
            );
            if (data.success) {
                setChatHistory(data.chats);
                return true;
            }
        } catch (error) {
            toast.error("Failed to send message");
            return false;
        }
    };

    const fetchChatHistory = async (ticketId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // FIXED URL: matches backend /ticket/:ticketId/chats
            const response = await axios.get(`${backendUrl}/api/user/ticket/${ticketId}/chats`, {
                headers: { token }
            });
            if (response.data.success) {
                setChatHistory(response.data.chats || []);
                return response.data.chats;
            }
        } catch (err) {
            setChatHistory([]);
        } finally { setLoading(false); }
    };

    return (
        <SupportContext.Provider value={{
            tickets, currentTicket, chatHistory, loading, error, mode, setMode, backendUrl,
            fetchUserTickets, createTicket, sendMessage, fetchChatHistory, setCurrentTicket,
        }}>
            {children}
        </SupportContext.Provider>
    );
};