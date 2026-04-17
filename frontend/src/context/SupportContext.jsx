import React, { createContext, useState, useContext } from 'react';
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

    const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '');

    const fetchUserTickets = async () => {
        const token = localStorage.getItem('token');
        if (!token) return [];

        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get(`${backendUrl}/api/user/my-tickets`, {
                headers: { token }
            });

            if (data.success) {
                const fetchedTickets = data.tickets || [];
                setTickets(fetchedTickets);
                return fetchedTickets;
            } else {
                setTickets([]);
                setError(data.message || 'Failed to fetch tickets');
                return [];
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to fetch tickets';
            setError(message);
            setTickets([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createTicket = async (issueType, description) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Please login first');
                return false;
            }

            const { data } = await axios.post(
                `${backendUrl}/api/user/create-ticket`,
                { issueType, description },
                { headers: { token } }
            );

            if (data.success) {
                await fetchUserTickets();
                return true;
            } else {
                toast.error(data.message || 'Failed to create ticket');
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to create ticket');
            return false;
        }
    };

    const sendMessage = async (ticketId, message) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Please login first');
                return false;
            }

            const { data } = await axios.post(
                `${backendUrl}/api/user/ticket/${ticketId}/message`,
                { message, mode },
                { headers: { token } }
            );

            if (data.success) {
                setChatHistory(data.chats || []);
                return true;
            } else {
                toast.error(data.message || 'Failed to send message');
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
            return false;
        }
    };

    const fetchChatHistory = async (ticketId) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setChatHistory([]);
                return [];
            }

            const { data } = await axios.get(
                `${backendUrl}/api/user/ticket/${ticketId}/chats`,
                {
                    headers: { token }
                }
            );

            if (data.success) {
                const chats = data.chats || [];
                setChatHistory(chats);
                return chats;
            } else {
                setChatHistory([]);
                setError(data.message || 'Failed to fetch chat history');
                return [];
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to fetch chat history';
            setError(message);
            setChatHistory([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return (
        <SupportContext.Provider
            value={{
                tickets,
                currentTicket,
                chatHistory,
                loading,
                error,
                mode,
                setMode,
                backendUrl,
                fetchUserTickets,
                createTicket,
                sendMessage,
                fetchChatHistory,
                setCurrentTicket
            }}
        >
            {children}
        </SupportContext.Provider>
    );
};