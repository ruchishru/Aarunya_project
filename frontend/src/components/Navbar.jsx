import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />

      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/helpdesk'>
          <li className='py-1'>🎫 Help Desk (Support)</li>
        </NavLink>
        <NavLink to='/analyze-prescription'>
          <li className='py-1'>PRESCRIPTION</li>
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {token && token !== 'null' && token !== 'false' && userData ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 rounded-full' src={userData.image} alt="User" />
            <img className='w-2.5' src={assets.dropdown_icon} alt="" />

            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4 shadow-md'>
                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                <p onClick={() => navigate('/helpdesk')} className='hover:text-black cursor-pointer'>Help Desk (AI)</p>
                <p onClick={() => navigate('/my-tickets')} className='hover:text-black cursor-pointer border-t pt-2'>Support Tickets (Manual)</p>
                <p onClick={logout} className='hover:text-black cursor-pointer text-red-500'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              window.scrollTo(0, 0)
              navigate('/login')
            }}
            className='bg-primary text-white px-8 py-3 rounded-full font-light block cursor-pointer relative z-[10000] hover:scale-105 transition-all'
          >
            Create account
          </button>
        )}

        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded full inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/helpdesk'><p className='px-4 py-2 rounded full inline-block'>HELP DESK</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/my-tickets'><p className='px-4 py-2 rounded full inline-block'>MY TICKETS</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar