import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown'; // 1. Import ReactMarkdown

const DietPlan = () => {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'Male',
        weight: '',
        height: '',
        activityLevel: 'Moderate',
        goal: 'Weight Loss',
        healthConditions: ''
    });
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Updated to your local port 4000
            const { data } = await axios.post('http://localhost:4000/api/user/get-diet-plan', formData, {
                headers: { token: localStorage.getItem('token') }
            });
            if (data.success) {
                setPlan(data.dietPlan);
                toast.success("Diet plan generated successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to fetch plan");
        }
        setLoading(false);
    };

    return (
        <div className="p-5 md:p-10 max-w-5xl mx-auto min-h-screen">
            <div className='mb-8'>
                <h2 className="text-3xl font-bold text-gray-800">AI Diet & Nutrition Assistant</h2>
                <p className='text-gray-500 mt-2'>Enter your body metrics to generate a professional nutrition roadmap.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-600 ml-1'>Age</label>
                    <input type="number" placeholder="e.g. 25" className="border rounded-xl p-3 outline-primary" onChange={e => setFormData({ ...formData, age: e.target.value })} required />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-600 ml-1'>Gender</label>
                    <select className="border rounded-xl p-3 outline-primary bg-white" onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-600 ml-1'>Weight (kg)</label>
                    <input type="number" placeholder="e.g. 70" className="border rounded-xl p-3 outline-primary" onChange={e => setFormData({ ...formData, weight: e.target.value })} required />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-600 ml-1'>Height (cm)</label>
                    <input type="number" placeholder="e.g. 175" className="border rounded-xl p-3 outline-primary" onChange={e => setFormData({ ...formData, height: e.target.value })} required />
                </div>

                <div className='flex flex-col gap-2 md:col-span-2'>
                    <label className='text-sm font-semibold text-gray-600 ml-1'>Health Goal</label>
                    <input type="text" placeholder="e.g. Muscle Gain, Weight Loss, Manage Diabetes" className="border rounded-xl p-3 outline-primary" onChange={e => setFormData({ ...formData, goal: e.target.value })} required />
                </div>

                <div className='flex flex-col gap-2 md:col-span-2'>
                    <label className='text-sm font-semibold text-gray-600 ml-1'>Medical Conditions / Allergies</label>
                    <textarea placeholder="List any conditions like Diabetes, Hypertension, or Nut Allergies..." className="border rounded-xl p-3 outline-primary h-28" onChange={e => setFormData({ ...formData, healthConditions: e.target.value })} />
                </div>

                <button type="submit" disabled={loading} className="bg-primary text-white p-4 rounded-xl md:col-span-2 font-bold text-lg hover:bg-opacity-90 transition-all shadow-md active:scale-95 disabled:bg-gray-400">
                    {loading ? "🤖 AI is analyzing your data..." : "Generate My Nutrition Plan 🥗"}
                </button>
            </form>

            {plan && (
                <div className="mt-12 p-10 bg-white border border-emerald-100 rounded-3xl shadow-xl">
                    {/* The 'prose' class is the magic key here */}
                    <div className="prose prose-emerald max-w-none 
                        prose-table:border-collapse 
                        prose-th:border prose-th:p-3 prose-th:bg-emerald-50
                        prose-td:border prose-td:p-3">
                        <ReactMarkdown>{plan}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DietPlan;