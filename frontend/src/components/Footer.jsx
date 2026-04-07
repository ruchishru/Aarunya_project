import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>This doctor appointment booking system is designed to help patients easily find doctors and schedule appointments online. The platform provides a simple and user-friendly interface for selecting doctors based on specialty and availability.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
         <ul className='flex flex-col gap-2 text-gray-600'>
  <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
  <li><Link to="/about" className="hover:text-blue-500">About us</Link></li>
   <li>Delivery</li>
   <li>Privacy policy</li>
</ul>

        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>6200703469</li>
            <li>aarunya1512@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright © 2026 Aarunya | Academic Project -All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
