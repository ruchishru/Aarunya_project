// =========================================================
// FILE: DiseasePredictor.jsx
// LOCATION: frontend\src\components\DiseasePredictor.jsx
// =========================================================

import { useState } from "react";

export default function DiseasePredictor({ onClose }) {

    const [screen, setScreen]    = useState("home");
    const [symptoms, setSymptoms] = useState("");
    const [disease, setDisease]  = useState("");
    const [doctor, setDoctor]    = useState("");
    const [error, setError]      = useState("");

    // Call Flask BERT API
    async function analyse() {
        if (!symptoms.trim()) {
            setError("Please enter your symptoms.");
            return;
        }
        setError("");
        setScreen("loading");

        try {
            const res = await fetch("http://127.0.0.1:5000/api/predict", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ symptoms })
            });
            const data = await res.json();
            setDisease(data.disease);
            setDoctor(data.doctor);
            setScreen("result");
        } catch (err) {
            setError("Could not connect to AI server. Make sure Flask is running.");
            setScreen("home");
        }
    }

    function goHome() {
        setScreen("home");
        setSymptoms("");
        setDisease("");
        setDoctor("");
        setError("");
    }

    return (
        <>
            {/* OVERLAY */}
            <div style={s.overlay} onClick={onClose}></div>

            {/* MODAL */}
            <div style={s.modal}>

                {/* Background blobs */}
                <div style={s.blob1}></div>
                <div style={s.blob2}></div>
                <div style={s.blob3}></div>

                {/* NAVBAR */}
                <div style={s.navbar}>
                    <div style={s.brand}>
                        <div style={s.brandIcon}>
                            <span style={{fontSize:'18px'}}>❤️</span>
                        </div>
                        <div>
                            <div style={s.brandName}>Aarunya</div>
                            <div style={s.brandSub}>Doctor Recommendation</div>
                        </div>
                    </div>
                    <button style={s.closeBtn} onClick={onClose}>✕ Close</button>
                </div>

                {/* ===== HOME SCREEN ===== */}
                {screen === "home" && (
                    <div style={s.content}>

                        {/* LEFT */}
                        <div style={s.left}>

                            <h1 style={s.title}>
                                Diagnose<br/>
                                <span style={s.titleEm}>Smarter.</span><br/>
                                Heal Faster.
                            </h1>

                            <p style={s.subtitle}>
                                Enter your symptoms and Aarunya's trained AI instantly
                                identifies your condition and recommends the right specialist.
                            </p>

                            {/* Form Card */}
                            <div style={s.formCard}>
                                <div style={s.formTop}>
                                    <div style={s.pulseDot}></div>
                                    <span style={s.formLabel}>SYMPTOM ANALYSER</span>
                                    <span style={s.formBadge}>BERT v1</span>
                                </div>

                                <div style={s.inputRow}>
                                    <input
                                        style={s.input}
                                        type="text"
                                        value={symptoms}
                                        onChange={e => setSymptoms(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && analyse()}
                                        placeholder="Describe symptoms e.g. fever, headache..."
                                    />
                                    <button style={s.analyseBtn} onClick={analyse}>
                                        → Analyse
                                    </button>
                                </div>

                                {error && <p style={s.error}>{error}</p>}

                                <div style={s.tags}>
                                    {["⚡ Instant","🔒 Private","✅ Matched","🤖 AI Powered"].map(t => (
                                        <span key={t} style={s.tag}>{t}</span>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT — Specialist Grid */}
                        <div style={s.right}>
                            <div style={s.specHeader}>OUR SPECIALISTS</div>
                            <div style={s.specGrid}>
                                {[
                                    { name:"Gastroenterology", role:"Gastroenterologist", bg:"linear-gradient(135deg,#e0f2fe,#bae6fd)", color:"#0284c7", icon:"💊" },
                                    { name:"Gynaecology",      role:"Gynaecologist",      bg:"linear-gradient(135deg,#fdf4ff,#f0abfc)", color:"#a21caf", icon:"♀️" },
                                    { name:"Dermatology",      role:"Dermatologist",      bg:"linear-gradient(135deg,#fef3c7,#fde68a)", color:"#b45309", icon:"🩹" },
                                    { name:"General Medicine", role:"General Physician",  bg:"linear-gradient(135deg,#d1fae5,#a7f3d0)", color:"#047857", icon:"🏥" },
                                    { name:"Orthopaedics",     role:"Orthopedic",         bg:"linear-gradient(135deg,#ffedd5,#fed7aa)", color:"#c2410c", icon:"🦴" },
                                    { name:"Paediatrics",      role:"Pediatrician",       bg:"linear-gradient(135deg,#e0e7ff,#c7d2fe)", color:"#3730a3", icon:"😊" },
                                    { name:"Neurology",        role:"Neurologist",        bg:"linear-gradient(135deg,#ffe4e6,#fecdd3)", color:"#be123c", icon:"🧠", wide:true },
                                ].map((spec, i) => (
                                    <div key={i} style={{
                                        ...s.specCard,
                                        gridColumn: spec.wide ? "1 / -1" : "auto"
                                    }}>
                                        <div style={{...s.specIcon, background:spec.bg, color:spec.color}}>
                                            {spec.icon}
                                        </div>
                                        <div>
                                            <div style={s.specName}>{spec.name}</div>
                                            <div style={s.specRole}>{spec.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* ===== LOADING SCREEN ===== */}
                {screen === "loading" && (
                    <div style={s.centered}>
                        <div style={s.spinner}></div>
                        <p style={s.loadingText}>Analysing your symptoms...</p>
                        <p style={{fontSize:'13px', color:'#9580c4'}}>Powered by BERT AI</p>
                    </div>
                )}

                {/* ===== RESULT SCREEN ===== */}
                {screen === "result" && (
                    <div style={s.resultWrap}>

                        {/* Check */}
                        <div style={s.checkCircle}>✓</div>
                        <h2 style={s.resultTitle}>Analysis Complete</h2>
                        <p style={s.resultSub}>Based on your symptoms, here is what our AI found</p>

                        {/* Result Cards */}
                        <div style={s.resultCards}>

                            <div style={s.resCard}>
                                <div style={{...s.resIcon, background:'linear-gradient(135deg,#fce7f3,#fbcfe8)', color:'#be185d'}}>
                                    📋
                                </div>
                                <p style={s.resLabel}>PREDICTED CONDITION</p>
                                <p style={s.resValue}>{disease}</p>
                                <div style={{...s.resBadge, background:'rgba(252,231,243,0.8)', color:'#be185d', border:'1px solid rgba(251,207,232,0.8)'}}>
                                    ⭐ AI Diagnosis
                                </div>
                            </div>

                            <div style={s.resCard}>
                                <div style={{...s.resIcon, background:'linear-gradient(135deg,#ede9fe,#ddd6fe)', color:'#6d28d9'}}>
                                    👨‍⚕️
                                </div>
                                <p style={s.resLabel}>RECOMMENDED SPECIALIST</p>
                                <p style={s.resValue}>{doctor}</p>
                                <div style={{...s.resBadge, background:'rgba(196,181,253,0.2)', color:'#6d28d9', border:'1px solid rgba(196,181,253,0.4)'}}>
                                    📅 Consult Now
                                </div>
                            </div>

                        </div>

                        {/* Disclaimer */}
                        <div style={s.disclaimer}>
                            ℹ️ This is an AI-assisted suggestion only. Please consult a
                            certified medical professional for accurate diagnosis and treatment.
                        </div>

                        {/* Buttons */}
                        <div style={s.resultBtns}>
                            <button style={s.outlineBtn} onClick={goHome}>
                                ← Analyse Again
                            </button>
                            <button style={s.fillBtn} onClick={onClose}>
                                ✕ Back to Home
                            </button>
                        </div>

                    </div>
                )}

            </div>

            {/* Spinner keyframe */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pDot {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%     { opacity:0.5; transform:scale(1.4); }
                }
                @keyframes blobDrift {
                    0%   { transform: translate(0,0) scale(1); }
                    100% { transform: translate(20px,15px) scale(1.06); }
                }
            `}</style>
        </>
    );
}

// =========================================================
// STYLES — Full lavender theme
// =========================================================
const s = {

    overlay: {
        position:'fixed', inset:0,
        background:'rgba(30,18,69,0.55)',
        backdropFilter:'blur(6px)',
        zIndex:1000,
    },

    modal: {
        position:'fixed',
        top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:'94vw', maxWidth:'1100px',
        height:'90vh',
        background:'linear-gradient(145deg,#f0ebff 0%,#e8e0ff 50%,#ece7ff 100%)',
        borderRadius:'32px',
        overflow:'hidden auto',
        zIndex:1001,
        boxShadow:'0 40px 80px rgba(90,33,182,0.40)',
        border:'1px solid rgba(196,181,253,0.45)',
    },

    blob1: {
        position:'absolute', width:'420px', height:'420px',
        borderRadius:'50%', filter:'blur(90px)', opacity:0.45,
        background:'radial-gradient(circle,#c4b5fd,#a78bfa)',
        top:'-120px', left:'-120px', pointerEvents:'none',
        animation:'blobDrift 14s ease-in-out infinite alternate',
    },
    blob2: {
        position:'absolute', width:'320px', height:'320px',
        borderRadius:'50%', filter:'blur(80px)', opacity:0.35,
        background:'radial-gradient(circle,#ddd6fe,#c4b5fd)',
        bottom:'-80px', right:'-80px', pointerEvents:'none',
        animation:'blobDrift 14s ease-in-out infinite alternate',
        animationDelay:'5s',
    },
    blob3: {
        position:'absolute', width:'250px', height:'250px',
        borderRadius:'50%', filter:'blur(70px)', opacity:0.25,
        background:'radial-gradient(circle,#ede9fe,#f5f3ff)',
        top:'40%', right:'20%', pointerEvents:'none',
        animation:'blobDrift 14s ease-in-out infinite alternate',
        animationDelay:'10s',
    },

    navbar: {
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 40px',
        background:'rgba(240,235,255,0.85)',
        backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(196,181,253,0.35)',
        position:'sticky', top:0, zIndex:10,
    },
    brand: { display:'flex', alignItems:'center', gap:'12px' },
    brandIcon: {
        width:'42px', height:'42px', borderRadius:'12px',
        background:'linear-gradient(135deg,#8b5cf6,#6d28d9)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 4px 14px rgba(139,92,246,0.45)',
    },
    brandName: {
        fontFamily:'Georgia,serif', fontSize:'19px',
        fontWeight:'700', color:'#1e1245', lineHeight:'1',
    },
    brandSub: {
        fontSize:'10px', color:'#8b7bb5',
        letterSpacing:'1px', textTransform:'uppercase',
    },
    closeBtn: {
        background:'rgba(196,181,253,0.22)',
        border:'1px solid rgba(196,181,253,0.45)',
        color:'#6d28d9', padding:'8px 18px',
        borderRadius:'20px', cursor:'pointer',
        fontSize:'13px', fontWeight:'500',
        transition:'background 0.2s',
    },

    content: {
        display:'flex', gap:'48px',
        padding:'40px', alignItems:'flex-start',
        position:'relative', zIndex:1, flexWrap:'wrap',
    },

    left: { flex:'1', minWidth:'280px', maxWidth:'480px' },

    title: {
        fontFamily:'Georgia,serif',
        fontSize:'clamp(38px,4vw,64px)',
        fontWeight:'700', lineHeight:'1.05',
        color:'#1e1245', marginBottom:'18px',
    },
    titleEm: {
        fontStyle:'italic',
        background:'linear-gradient(135deg,#a78bfa,#6d28d9)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        backgroundClip:'text',
    },
    subtitle: {
        fontSize:'15px', fontWeight:'300',
        lineHeight:'1.8', color:'#4c3d7a',
        marginBottom:'32px',
    },

    formCard: {
        background:'rgba(255,255,255,0.90)',
        backdropFilter:'blur(28px)',
        border:'1px solid rgba(196,181,253,0.45)',
        borderRadius:'24px', padding:'26px',
        boxShadow:'0 20px 60px rgba(90,33,182,0.20)',
    },
    formTop: {
        display:'flex', alignItems:'center',
        gap:'10px', marginBottom:'18px',
    },
    pulseDot: {
        width:'10px', height:'10px', borderRadius:'50%',
        background:'#34d399', flexShrink:'0',
        animation:'pDot 2s ease-in-out infinite',
    },
    formLabel: {
        fontSize:'11px', fontWeight:'600',
        color:'#4c3d7a', letterSpacing:'0.8px', flex:'1',
    },
    formBadge: {
        fontSize:'11px', color:'#8b5cf6',
        background:'rgba(139,92,246,0.10)',
        border:'1px solid rgba(139,92,246,0.22)',
        padding:'3px 10px', borderRadius:'10px',
    },

    inputRow: { display:'flex', gap:'8px', marginBottom:'14px' },
    input: {
        flex:'1', border:'1.5px solid #ddd6fe',
        borderRadius:'14px', padding:'12px 16px',
        fontSize:'14px', outline:'none',
        fontFamily:'inherit', background:'#f5f3ff',
        color:'#1e1245',
    },
    analyseBtn: {
        background:'linear-gradient(135deg,#8b5cf6,#6d28d9)',
        color:'#fff', border:'none',
        padding:'12px 22px', borderRadius:'12px',
        fontSize:'14px', fontWeight:'500',
        cursor:'pointer', whiteSpace:'nowrap',
        boxShadow:'0 4px 16px rgba(139,92,246,0.42)',
    },
    error: { color:'#be185d', fontSize:'13px', marginBottom:'10px' },

    tags: { display:'flex', gap:'8px', flexWrap:'wrap' },
    tag: {
        fontSize:'11px', color:'#8b7bb5',
        background:'rgba(196,181,253,0.16)',
        border:'1px solid rgba(196,181,253,0.30)',
        padding:'5px 11px', borderRadius:'20px',
    },

    right: { flex:'1', minWidth:'260px', position:'relative', zIndex:1 },
    specHeader: {
        fontSize:'11px', fontWeight:'700', color:'#8b7bb5',
        letterSpacing:'1.5px', textTransform:'uppercase',
        marginBottom:'16px',
    },
    specGrid: {
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px',
    },
    specCard: {
        display:'flex', alignItems:'center', gap:'12px',
        background:'rgba(255,255,255,0.68)',
        backdropFilter:'blur(16px)',
        border:'1px solid rgba(196,181,253,0.38)',
        borderRadius:'16px', padding:'14px 16px',
        boxShadow:'0 2px 14px rgba(109,40,217,0.09)',
        cursor:'default',
        transition:'transform 0.2s, box-shadow 0.2s',
    },
    specIcon: {
        width:'44px', height:'44px', borderRadius:'12px',
        display:'flex', alignItems:'center',
        justifyContent:'center', fontSize:'20px', flexShrink:'0',
    },
    specName: {
        fontSize:'13px', fontWeight:'500',
        color:'#1e1245', marginBottom:'2px',
    },
    specRole: { fontSize:'11px', fontWeight:'300', color:'#8b7bb5' },

    centered: {
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        height:'65vh', gap:'20px', position:'relative', zIndex:1,
    },
    spinner: {
        width:'52px', height:'52px',
        border:'4px solid rgba(196,181,253,0.30)',
        borderTop:'4px solid #8b5cf6',
        borderRadius:'50%',
        animation:'spin 0.8s linear infinite',
    },
    loadingText: { color:'#4c3d7a', fontSize:'17px', fontWeight:'400' },

    resultWrap: {
        display:'flex', flexDirection:'column',
        alignItems:'center', padding:'48px 24px',
        position:'relative', zIndex:1,
    },
    checkCircle: {
        width:'72px', height:'72px', borderRadius:'50%',
        background:'linear-gradient(135deg,#a78bfa,#6d28d9)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'32px', color:'#fff', marginBottom:'20px',
        boxShadow:'0 8px 28px rgba(139,92,246,0.42)',
    },
    resultTitle: {
        fontFamily:'Georgia,serif',
        fontSize:'clamp(28px,3.5vw,46px)', fontWeight:'700',
        color:'#1e1245', marginBottom:'8px',
    },
    resultSub: {
        fontSize:'15px', color:'#8b7bb5',
        marginBottom:'40px', fontWeight:'300',
    },
    resultCards: {
        display:'flex', gap:'24px',
        flexWrap:'wrap', justifyContent:'center',
        marginBottom:'32px',
    },
    resCard: {
        background:'rgba(255,255,255,0.90)',
        backdropFilter:'blur(24px)',
        border:'1px solid rgba(196,181,253,0.40)',
        borderRadius:'28px', padding:'40px 48px',
        textAlign:'center', minWidth:'250px',
        boxShadow:'0 8px 40px rgba(109,40,217,0.14)',
    },
    resIcon: {
        width:'68px', height:'68px', borderRadius:'50%',
        display:'flex', alignItems:'center',
        justifyContent:'center', fontSize:'30px',
        margin:'0 auto 18px',
        boxShadow:'0 4px 14px rgba(0,0,0,0.08)',
    },
    resLabel: {
        fontSize:'10px', textTransform:'uppercase',
        letterSpacing:'1.8px', color:'#8b7bb5',
        fontWeight:'700', marginBottom:'12px',
    },
    resValue: {
        fontFamily:'Georgia,serif',
        fontSize:'30px', fontWeight:'400',
        color:'#1e1245', marginBottom:'20px', lineHeight:'1.2',
    },
    resBadge: {
        display:'inline-flex', alignItems:'center', gap:'6px',
        fontSize:'12px', fontWeight:'500',
        padding:'7px 16px', borderRadius:'20px',
    },
    disclaimer: {
        background:'rgba(255,255,255,0.60)',
        backdropFilter:'blur(14px)',
        border:'1px solid rgba(196,181,253,0.32)',
        borderRadius:'18px', padding:'16px 24px',
        maxWidth:'560px', textAlign:'center',
        fontSize:'13px', color:'#4c3d7a',
        lineHeight:'1.7', marginBottom:'32px',
    },
    resultBtns: {
        display:'flex', gap:'14px',
        flexWrap:'wrap', justifyContent:'center',
    },
    outlineBtn: {
        background:'rgba(255,255,255,0.82)',
        color:'#6d28d9',
        border:'1.5px solid rgba(196,181,253,0.55)',
        padding:'13px 26px', borderRadius:'12px',
        fontSize:'14px', fontWeight:'500', cursor:'pointer',
        backdropFilter:'blur(8px)',
    },
    fillBtn: {
        background:'linear-gradient(135deg,#8b5cf6,#6d28d9)',
        color:'#fff', border:'none',
        padding:'13px 26px', borderRadius:'12px',
        fontSize:'14px', fontWeight:'500', cursor:'pointer',
        boxShadow:'0 4px 18px rgba(139,92,246,0.42)',
    },
};