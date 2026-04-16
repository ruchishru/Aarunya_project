import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₹'
    // FIX 1: Add a fallback for backendUrl to prevent "undefined" errors
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(false)

    // FIX 2: Add a listener for the token. 
    // This ensures that whenever setToken is called, localStorage is also updated.
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }, [token])

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const getDoctosData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Fetch Doctors Error:", error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            // FIX 3: Double check token is present before calling
            if (!token) return;

            const { data } = await axios.post(backendUrl + '/api/user/get-profile', {}, {
                headers: { token }
            })

            if (data.success) {
                setUserData(data.userData)
            } else {
                // If token is expired or invalid
                toast.error(data.message)
                setToken('')
            }
        } catch (error) {
            console.error("Profile Load Error:", error)
            // If the error is 401/403 (Unauthorized), clear the token
            if (error.response?.status === 401) {
                setToken('')
            }
        }
    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    const value = {
        doctors, getDoctosData,
        currencySymbol, backendUrl,
        token, setToken,
        userData, setUserData,
        loadUserProfileData,
        calculateAge, slotDateFormat
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider