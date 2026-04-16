import React, { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyTickets = () => {
    const { backendUrl, token } = useContext(AppContext)
    const [tickets, setTickets] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [userReply, setUserReply] = useState('')
    const chatEndRef = useRef(null)

    const getUserTickets = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/my-tickets', { headers: { token } })
            if (data.success) {
                setTickets(data.tickets.reverse())
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleSendMessage = async () => {
        if (!userReply.trim()) return toast.error("Please type a message");
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/ticket/${selectedTicket._id}/message`,
                { message: userReply },
                { headers: { token } }
            );
            if (data.success) {
                setUserReply('');
                const newMessage = { sender: 'user', message: userReply, timestamp: new Date() };
                setSelectedTicket(prev => ({ ...prev, chats: [...prev.chats, newMessage] }));
                getUserTickets();
            }
        } catch (error) {
            toast.error("Error sending message");
        }
    };

    useEffect(() => {
        if (token) getUserTickets()
    }, [token])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedTicket?.chats]);

    return (
        <div className='m-5 max-w-4xl mx-auto'>
            <p className='mb-6 text-xl font-semibold'>My Support Tickets</p>
            <div className='flex flex-col gap-4'>
                {tickets.map((item, index) => (
                    <div key={index} className='flex justify-between items-center p-5 border rounded-2xl bg-white shadow-sm'>
                        <div>
                            <div className='flex items-center gap-3 mb-1'>
                                <p className='font-bold capitalize'>{item.issueType || "Technical"}</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className='text-xs text-gray-500'>{item.description}</p>
                        </div>
                        <button onClick={() => setSelectedTicket(item)} className='bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold'>Open Chat</button>
                    </div>
                ))}
            </div>

            {selectedTicket && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg flex flex-col h-[600px] overflow-hidden shadow-2xl">
                        <div className="p-5 border-b flex justify-between items-center">
                            <p className="font-bold">Support Chat</p>
                            <button onClick={() => setSelectedTicket(null)} className="text-2xl text-gray-400">&times;</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-[#F8F9FA]">
                            {selectedTicket.chats.map((chat, i) => (
                                <div key={i} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${chat.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border rounded-tl-none'}`}>
                                        <p>{chat.message}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="p-5 border-t">
                            {selectedTicket.status !== 'Resolved' ? (
                                <div className='flex flex-col gap-3'>
                                    <textarea value={userReply} onChange={(e) => setUserReply(e.target.value)} placeholder="Type here..." className='w-full border rounded-2xl p-3 text-sm h-20 outline-none' />
                                    <button onClick={handleSendMessage} className='w-full bg-primary text-white py-3 rounded-xl font-bold'>Send Message</button>
                                </div>
                            ) : <p className="text-center text-green-600 font-bold">Issue Resolved</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyTickets