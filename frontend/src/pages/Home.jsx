import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import DiseasePredictor from '../components/DiseasePredictor'

const Home = () => {

  const [showPredictor, setShowPredictor] = useState(false)
  const navigate = useNavigate()

  return (
    <div>
      <Header />

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        padding: '40px 20px 10px',
      }}>
        {/* ===== AI DISEASE PREDICTOR CARD ===== */}
        <div style={{
          background: 'linear-gradient(135deg,#f0ebff,#e8e0ff)',
          border: '1.5px solid rgba(196,181,253,0.5)',
          borderRadius: '20px',
          padding: '24px 40px',
          textAlign: 'center',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(109,40,217,0.12)',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: '600',
            color: '#8b7bb5', letterSpacing: '1.2px',
            textTransform: 'uppercase', marginBottom: '10px',
          }}>
            🤖 Powered by BERT AI
          </p>
          <h2 style={{
            fontFamily: 'Georgia,serif',
            fontSize: 'clamp(18px,2vw,24px)',
            fontWeight: '700', color: '#1e1245',
            marginBottom: '10px', lineHeight: '1.3',
          }}>
            Not sure which doctor to visit?
          </h2>
          <p style={{
            fontSize: '14px', color: '#4c3d7a',
            fontWeight: '300', lineHeight: '1.6',
            marginBottom: '22px',
          }}>
            Describe your symptoms and our AI will instantly identify
            your condition and recommend the right specialist.
          </p>
          <button
            onClick={() => setShowPredictor(true)}
            style={{
              background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
              color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: '14px',
              fontSize: '14px', fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(139,92,246,0.42)',
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🧠 Check My Symptoms
          </button>
        </div>

        {/* ===== AI DIET & NUTRITION CARD ===== */}
        <div style={{
          background: 'linear-gradient(135deg,#e6fffa,#d1fff5)',
          border: '1.5px solid rgba(129,230,217,0.5)',
          borderRadius: '20px',
          padding: '24px 40px',
          textAlign: 'center',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(45,160,140,0.1)',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: '600',
            color: '#2d7a6e', letterSpacing: '1.2px',
            textTransform: 'uppercase', marginBottom: '10px',
          }}>
            🥗 Powered by Gemini AI
          </p>
          <h2 style={{
            fontFamily: 'Georgia,serif',
            fontSize: 'clamp(18px,2vw,24px)',
            fontWeight: '700', color: '#064e3b',
            marginBottom: '10px', lineHeight: '1.3',
          }}>
            Need a Personalized Diet Plan?
          </h2>
          <p style={{
            fontSize: '14px', color: '#065f46',
            fontWeight: '300', lineHeight: '1.6',
            marginBottom: '22px',
          }}>
            Enter your metrics and health goals to receive a custom
            nutrition roadmap designed specifically for your body.
          </p>
          <button
            onClick={() => navigate('/diet-recommendation')}
            style={{
              background: 'linear-gradient(135deg,#10b981,#059669)',
              color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: '14px',
              fontSize: '14px', fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(16,185,129,0.3)',
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🍎 Get My Diet Plan
          </button>
        </div>
      </div>

      <SpecialityMenu />
      <TopDoctors />
      <Banner />

      {/* ===== DISEASE PREDICTOR MODAL ===== */}
      {showPredictor && (
        <DiseasePredictor onClose={() => setShowPredictor(false)} />
      )}

    </div>
  )
}

export default Home