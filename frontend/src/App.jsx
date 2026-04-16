import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Verify from './pages/Verify'
import HelpDesk from './pages/HelpDesk'
import MyTickets from './pages/MyTickets'
import Prescription from './pages/Prescription'
import DietPlan from './pages/DietPlan'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%] relative'>
      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/helpdesk' element={<HelpDesk />} />
        <Route path='/symptom-checker' element={<div>Symptom Checker Coming Soon!</div>} />
        <Route path='/analyze-prescription' element={<Prescription />} />
        <Route path='/diet-plan' element={<DietPlan />} />
        <Route path='/my-tickets' element={<MyTickets />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App