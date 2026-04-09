import React, { useState } from 'react';
import axios from 'axios';

const Prescription = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (file) => {
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleAnalyze = async () => {
        if (!image) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const { data } = await axios.post(
                'http://localhost:4000/api/user/analyze-prescription',
                formData
            );

            if (data.success) {
                setResult(data.analysis);
            }
        } catch (error) {
            console.error("Analysis failed", error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        Prescription <span className="text-indigo-600">AI Analyzer</span>
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Upload your prescription and get instant AI-powered insights
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10">

                    {/* Upload Card */}
                    <div className="backdrop-blur-lg bg-white/70 p-6 rounded-3xl shadow-xl border border-white/40">

                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleDrop}
                            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer 
                            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-indigo-50'}`}
                        >
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />

                            {preview ? (
                                <div className="w-full text-center">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-52 object-contain rounded-xl mb-4"
                                    />
                                    <button
                                        onClick={() => {
                                            setImage(null);
                                            setPreview(null);
                                            setResult("");
                                        }}
                                        className="text-sm text-red-500 hover:underline"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-indigo-100 p-5 rounded-full mb-4 shadow-inner">
                                        📤
                                    </div>
                                    <p className="font-medium text-gray-700">
                                        Drag & drop or click to upload
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        PNG, JPG up to 10MB
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={!image || loading}
                            className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 
                            ${!image || loading
                                    ? 'bg-gray-200 text-gray-400'
                                    : 'bg-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Analyzing...
                                </>
                            ) : "Analyze Prescription"}
                        </button>
                    </div>

                    {/* Results Card */}
                    <div className="backdrop-blur-lg bg-white/70 p-6 rounded-3xl shadow-xl border border-white/40 flex flex-col">

                        <div className="flex items-center gap-2 mb-4 border-b pb-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                            <h2 className="font-semibold text-gray-700">
                                AI Insights
                            </h2>
                        </div>

                        {!result && !loading && (
                            <div className="flex-1 flex items-center justify-center text-gray-400 italic">
                                Waiting for analysis...
                            </div>
                        )}

                        {loading && (
                            <div className="space-y-4 animate-pulse mt-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        )}

                        {result && (
                            <div className="flex-1 overflow-y-auto">
                                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed border-l-4 border-indigo-500 pl-4">
                                    {result}
                                </p>

                                {/* Disclaimer */}
                                <div className="mt-6 bg-yellow-100 p-4 rounded-xl text-xs text-yellow-800 flex gap-2 shadow-sm">
                                    ⚠️ This AI-generated summary is for informational purposes only.
                                    Always consult a doctor.
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Prescription;