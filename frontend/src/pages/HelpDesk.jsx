import React, { useState, useEffect, useRef } from 'react';
import { useSupport } from '../context/SupportContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const HelpDesk = () => {
    const { createTicket, fetchUserTickets, backendUrl } = useSupport();
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [input, setInput] = useState('');
    const [ticketData, setTicketData] = useState({
        issueType: 'Technical',
        description: ''
    });

    const [helpMessages, setHelpMessages] = useState([
        {
            sender: 'bot',
            reply: {
                title: 'Aarunya AI Help Desk',
                summary: 'Hi! Tell me your symptom or issue, and I’ll guide you.',
                specialist: 'Support Assistant',
                advice: [
                    'Describe your symptoms clearly.',
                    'You can also ask about payments, bookings, or cancellations.',
                    'If needed, you can raise a Manual Ticket.'
                ]
            },
            doctors: []
        }
    ]);

    const chatEndRef = useRef(null);

    const supportSuggestions = [
        'I have fever and cough',
        'I have skin rashes',
        'I have headache and dizziness',
        'I have chest pain',
        'My payment failed',
        'Cancel my appointment'
    ];

    useEffect(() => {
        fetchUserTickets();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [helpMessages]);

    const handleSendChat = async (e, forcedInput = null) => {
        if (e) e.preventDefault();

        const finalInput = forcedInput || input;
        if (!finalInput.trim()) return;

        setHelpMessages(prev => [
            ...prev,
            { sender: 'user', text: finalInput }
        ]);
        setInput('');

        try {
            const base = backendUrl ? backendUrl.replace(/\/$/, '') : 'http://localhost:4000';
            const targetUrl = `${base}/api/user/chat-ai`;

            const { data } = await axios.post(
                targetUrl,
                { message: finalInput },
                {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            );

            if (data.success) {
                setHelpMessages(prev => [
                    ...prev,
                    {
                        sender: 'bot',
                        type: data.type || 'text',
                        reply: data.reply,
                        doctors: data.doctors || []
                    }
                ]);
            } else {
                toast.error(data.message || 'AI logic failed');
            }
        } catch (error) {
            console.error('Axios Error:', error);
            toast.error(error.response?.data?.message || 'AI is currently unavailable');
        }
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();

        if (!ticketData.description) {
            return toast.error('Please add a description');
        }

        const success = await createTicket(
            ticketData.issueType,
            ticketData.description
        );

        if (success) {
            toast.success('Ticket raised successfully!');
            setShowForm(false);
            setTicketData({
                issueType: 'Technical',
                description: ''
            });
        }
    };

    return (
        <div className='max-w-[1100px] mx-auto pb-20 px-4'>
            <div className='flex flex-col lg:flex-row gap-8 pt-10'>
                <div className='flex-[2] bg-white border border-pink-50 rounded-[2rem] shadow-xl flex flex-col h-[650px] overflow-hidden'>
                    <div className='p-4 border-b flex items-center gap-3 bg-pink-50'>
                        <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center'>🤖</div>
                        <div>
                            <p className='font-bold text-sm text-gray-700'>Aarunya AI Help Desk</p>
                            <p className='text-xs text-gray-500'>Smart support + specialist guidance</p>
                        </div>
                    </div>

                    <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#fcfcff]'>
                        {helpMessages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {m.sender === 'user' ? (
                                    <div className='max-w-[80%] px-4 py-2 rounded-2xl text-sm bg-primary text-white shadow'>
                                        {m.text}
                                    </div>
                                ) : (
                                    <div className='max-w-[88%] bg-gray-100 text-gray-700 rounded-2xl p-4 text-sm space-y-3 shadow-sm'>
                                        {typeof m.reply === 'string' && <p>{m.reply}</p>}

                                        {typeof m.reply === 'object' && m.reply && (
                                            <>
                                                <p className='font-semibold text-gray-800 text-base'>
                                                    {m.reply.title}
                                                </p>

                                                {m.reply.summary && (
                                                    <p>🧠 {m.reply.summary}</p>
                                                )}

                                                {m.reply.possibleIssue && (
                                                    <p>⚠️ {m.reply.possibleIssue}</p>
                                                )}

                                                {m.reply.specialist && (
                                                    <p className='text-primary font-semibold'>
                                                        👨‍⚕️ Recommended: {m.reply.specialist}
                                                    </p>
                                                )}

                                                {Array.isArray(m.reply.advice) && m.reply.advice.length > 0 && (
                                                    <ul className='list-disc ml-5 space-y-1'>
                                                        {m.reply.advice.map((a, idx) => (
                                                            <li key={idx}>{a}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {m.doctors?.length > 0 && (
                                                    <div className='mt-3 border-t pt-3'>
                                                        <p className='font-semibold mb-2 text-gray-800'>
                                                            Suggested Doctors
                                                        </p>

                                                        <div className='space-y-2'>
                                                            {m.doctors.map((doc) => (
                                                                <div
                                                                    key={doc._id}
                                                                    className='flex items-center gap-3 border p-3 rounded-xl bg-white'
                                                                >
                                                                    <img
                                                                        src={doc.image}
                                                                        alt={doc.name}
                                                                        className='w-12 h-12 rounded-full object-cover'
                                                                    />

                                                                    <div className='flex-1'>
                                                                        <p className='text-sm font-semibold'>
                                                                            {doc.name}
                                                                        </p>
                                                                        <p className='text-xs text-gray-500'>
                                                                            {doc.speciality}
                                                                        </p>
                                                                        {doc.degree && (
                                                                            <p className='text-xs text-gray-400'>
                                                                                {doc.degree}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <button
                                                                        onClick={() => navigate(`/appointment/${doc._id}`)}
                                                                        className='text-xs bg-primary text-white px-3 py-1.5 rounded-lg'
                                                                    >
                                                                        Book
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div ref={chatEndRef} />
                    </div>

                    <div className='flex gap-2 p-3 overflow-x-auto no-scrollbar bg-gray-50 border-t'>
                        {supportSuggestions.map((query) => (
                            <button
                                key={query}
                                onClick={() => handleSendChat(null, query)}
                                className='text-[11px] border border-gray-200 bg-white px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-primary hover:text-white transition-all shadow-sm'
                            >
                                {query}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSendChat} className='p-3 border-t flex gap-2 bg-white'>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className='flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm outline-none'
                            placeholder='Describe your symptoms or issue...'
                        />
                        <button
                            type='submit'
                            className='px-4 py-2 rounded-full text-white text-sm bg-primary'
                        >
                            Send
                        </button>
                    </form>
                </div>

                <div className='flex-1 flex flex-col gap-4'>
                    <div className='p-6 rounded-[2rem] text-white text-center shadow-lg bg-primary'>
                        <p className='font-bold mb-4'>Need Human Help?</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className='w-full bg-white py-3 rounded-xl font-bold text-sm text-primary'
                        >
                            Raise Manual Ticket
                        </button>
                    </div>

                    <div className='p-6 rounded-[2rem] text-white text-center shadow-lg bg-indigo-500'>
                        <p className='font-bold mb-4'>Looking for Doctors?</p>
                        <button
                            onClick={() => navigate('/doctors')}
                            className='w-full bg-white py-3 rounded-xl font-bold text-sm text-indigo-500'
                        >
                            View All Doctors
                        </button>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <form
                        onSubmit={handleTicketSubmit}
                        className='bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl'
                    >
                        <h2 className='font-bold mb-4'>Manual Support Ticket</h2>

                        <select
                            className='w-full bg-gray-50 p-3 rounded-lg mb-4 outline-none'
                            value={ticketData.issueType}
                            onChange={(e) =>
                                setTicketData({ ...ticketData, issueType: e.target.value })
                            }
                        >
                            <option value='Technical'>Technical</option>
                            <option value='Payment'>Payment</option>
                            <option value='Booking'>Booking</option>
                            <option value='Other'>Other</option>
                        </select>

                        <textarea
                            className='w-full bg-gray-50 p-3 rounded-lg h-32 mb-4 outline-none'
                            placeholder='How can a human agent help you?'
                            value={ticketData.description}
                            onChange={(e) =>
                                setTicketData({
                                    ...ticketData,
                                    description: e.target.value
                                })
                            }
                        />

                        <div className='flex gap-2'>
                            <button
                                type='button'
                                onClick={() => setShowForm(false)}
                                className='flex-1 py-2 text-gray-500'
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                className='flex-1 bg-primary text-white py-2 rounded-lg font-bold'
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default HelpDesk;