import React, { useContext, useEffect, useState, useRef } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const SupportTickets = () => {
    const [tickets, setTickets] = useState([])
    const { aToken, backendUrl } = useContext(AdminContext)
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [adminReply, setAdminReply] = useState('');

    const chatEndRef = useRef(null);

    const getTickets = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-tickets', { headers: { atoken: aToken } })
            if (data.success) {
                setTickets(data.tickets)
            }
        } catch (error) {
            console.error("Axios Error:", error)
            toast.error("Network Error: Is the backend running?")
        }
    }

    const handleReply = async (shouldResolve) => {
        if (!adminReply.trim()) return toast.error("Please type a message");

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/reply-ticket',
                {
                    ticketId: selectedTicket._id,
                    message: adminReply,
                    status: shouldResolve ? 'Resolved' : 'In Progress'
                },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success(shouldResolve ? "Ticket Resolved & Closed" : "Message Sent");
                setAdminReply('');
                getTickets();

                if (shouldResolve) {
                    setSelectedTicket(null);
                } else {
                    // Update local modal view with new message
                    const updatedTickets = await axios.get(backendUrl + '/api/admin/all-tickets', { headers: { atoken: aToken } });
                    const current = updatedTickets.data.tickets.find(t => t._id === selectedTicket._id);
                    setSelectedTicket(current);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const removeTicket = async (ticketId) => {
        if (window.confirm("Permanently delete this ticket record?")) {
            try {
                const { data } = await axios.post(backendUrl + '/api/admin/delete-ticket', { ticketId }, { headers: { atoken: aToken } })
                if (data.success) {
                    toast.success("Ticket deleted successfully")
                    getTickets()
                }
            } catch (error) {
                toast.error("Error deleting ticket")
            }
        }
    }

    useEffect(() => {
        if (aToken) { getTickets() }
    }, [aToken])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedTicket]);

    return (
        <div className='m-5 w-full max-w-6xl'>
            <p className='mb-3 text-lg font-medium font-sans'>Aarunya Support Dashboard</p>
            <div className='bg-white border rounded shadow-sm text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>

                <div className='hidden sm:grid grid-cols-[0.5fr_1.5fr_2fr_1fr_1fr_1fr] py-4 px-6 border-b bg-gray-50 font-bold text-gray-600'>
                    <p>#</p>
                    <p>User</p>
                    <p>Description</p>
                    <p>Status</p>
                    <p>Date</p>
                    <p className='text-center'>Actions</p>
                </div>

                {tickets.map((item, index) => (
                    <div key={index} className="grid grid-cols-[0.5fr_1.5fr_2fr_1fr_1fr_1fr] items-center py-4 px-6 border-b hover:bg-blue-50/30 transition-all">
                        <p className='text-gray-400'>{index + 1}</p>
                        <p className='font-semibold text-gray-800'>{item.userId?.name || "Guest User"}</p>
                        <p className='truncate pr-8 text-gray-600' title={item.description}>{item.description}</p>
                        <p className={`px-2 py-1 rounded-md text-[10px] w-fit font-bold uppercase ${item.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {item.status || 'Open'}
                        </p>
                        <p className='text-gray-500 text-xs'>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</p>

                        <div className='flex items-center justify-center gap-4'>
                            <button
                                onClick={() => setSelectedTicket(item)}
                                className='bg-primary text-white px-4 py-1.5 rounded-lg text-[10px] font-bold hover:brightness-110 shadow-sm transition-all'
                            >
                                Open Chat
                            </button>
                            <img
                                onClick={() => removeTicket(item._id)}
                                className="w-5 cursor-pointer opacity-50 hover:opacity-100 hover:scale-110 transition-all"
                                src={assets.cancel_icon}
                                alt="Delete"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {selectedTicket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-xl flex flex-col h-[650px] shadow-2xl overflow-hidden">

                        <div className="p-5 border-b flex justify-between items-center bg-white">
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold'>
                                    {selectedTicket.userId?.name.charAt(0) || 'G'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Chat with {selectedTicket.userId?.name || 'Guest'}</p>
                                    <p className="text-[10px] text-gray-400 font-mono">ID: {selectedTicket._id.slice(-6)}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 text-2xl transition-all">&times;</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-[#F9FAFB]">
                            <div className='bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-2'>
                                <p className='text-[10px] font-black text-blue-400 uppercase mb-1'>Original Issue Description</p>
                                <p className='text-sm text-blue-900'>{selectedTicket.description}</p>
                            </div>

                            {selectedTicket.chats && selectedTicket.chats
                                .filter(chat => !chat.message.includes("Aarunya Support Friend"))
                                .map((chat, i) => (
                                    <div key={i} className={`flex ${chat.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${chat.sender === 'user'
                                                ? 'bg-white text-gray-800 border-gray-100 border'
                                                : 'bg-primary text-white rounded-tr-none'
                                            }`}>
                                            <p className={`text-[8px] font-bold uppercase mb-1 ${chat.sender === 'user' ? 'text-gray-400' : 'text-blue-100'}`}>
                                                {chat.sender === 'admin' ? 'Agent (You)' : 'User'} • {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className='leading-relaxed'>{chat.message}</p>
                                        </div>
                                    </div>
                                ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-5 border-t bg-white">
                            <textarea
                                value={adminReply}
                                onChange={(e) => setAdminReply(e.target.value)}
                                placeholder="Type a message to the patient..."
                                className="w-full border border-gray-100 rounded-2xl p-4 text-sm outline-none bg-gray-50 h-24 resize-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => handleReply(false)}
                                    className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold text-xs hover:bg-gray-200 transition-all"
                                >
                                    Just Send Message
                                </button>
                                <button
                                    onClick={() => handleReply(true)}
                                    className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold text-xs hover:brightness-110 transition-all shadow-md"
                                >
                                    Resolve & Close Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SupportTickets