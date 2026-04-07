import React, { useState } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import DiseasePredictor from '../components/DiseasePredictor'

const Home = () => {

  const [showPredictor, setShowPredictor] = useState(false)

  return (
    <div>
      <Header />

      {/* ===== AI DISEASE PREDICTOR BUTTON ===== */}
      <div style={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        padding:'40px 20px 10px',
      }}>
        <div style={{
          background:'linear-gradient(135deg,#f0ebff,#e8e0ff)',
          border:'1.5px solid rgba(196,181,253,0.5)',
          borderRadius:'20px',
          padding:'24px 40px',
          textAlign:'center',
          maxWidth:'560px',
          width:'100%',
          boxShadow:'0 8px 32px rgba(109,40,217,0.12)',
        }}>
          <p style={{
            fontSize:'13px', fontWeight:'600',
            color:'#8b7bb5', letterSpacing:'1.2px',
            textTransform:'uppercase', marginBottom:'10px',
          }}>
            🤖 Powered by BERT AI
          </p>
          <h2 style={{
            fontFamily:'Georgia,serif',
            fontSize:'clamp(20px,2.5vw,28px)',
            fontWeight:'700', color:'#1e1245',
            marginBottom:'10px', lineHeight:'1.3',
          }}>
            Not sure which doctor to visit?
          </h2>
          <p style={{
            fontSize:'14px', color:'#4c3d7a',
            fontWeight:'300', lineHeight:'1.7',
            marginBottom:'22px',
          }}>
            Describe your symptoms and our AI will instantly identify
            your condition and recommend the right specialist.
          </p>
          <button
            onClick={() => setShowPredictor(true)}
            style={{
              background:'linear-gradient(135deg,#8b5cf6,#6d28d9)',
              color:'#fff', border:'none',
              padding:'14px 32px', borderRadius:'14px',
              fontSize:'15px', fontWeight:'600',
              cursor:'pointer',
              boxShadow:'0 4px 18px rgba(139,92,246,0.42)',
              display:'inline-flex', alignItems:'center', gap:'10px',
              transition:'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}
          >
            🧠 Check My Symptoms
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