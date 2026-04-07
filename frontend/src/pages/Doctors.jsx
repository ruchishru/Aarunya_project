import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {
  

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)


const [messages, setMessages] = useState([
  { from: "bot", text: "Hi! Tell me your problem and I’ll find the right doctor." }
]);




const [userInput, setUserInput] = useState("");
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])



  const handleSend = () => {
  if (!userInput.trim()) return;

  const newMessages = [...messages, { from: "user", text: userInput }];
  setMessages(newMessages);

 if (!doctors || doctors.length === 0) {
    setMessages([
      ...newMessages,
      { from: "bot", text: "Doctors data is still loading. Please try again." }
    ]);
    return;
  }


  const text = userInput.toLowerCase();

  let matchedSpeciality = "";

  if (text.includes("fever") || text.includes("cold") || text.includes("pain")) {
    matchedSpeciality = "General physician";
  } else if (text.includes("skin") || text.includes("rash") || text.includes("acne")) {
    matchedSpeciality = "Dermatologist";
  } else if (text.includes("baby") || text.includes("child")) {
    matchedSpeciality = "Pediatricians";
  } else if (text.includes("head") || text.includes("brain") || text.includes("migraine")) {
    matchedSpeciality = "Neurologist";
  } else if (text.includes("stomach") || text.includes("digestion")) {
    matchedSpeciality = "Gastroenterologist";
  } else {
    matchedSpeciality = "General physician";
  }

  const matchedDoctors = doctors.filter(
    doc => doc.speciality === matchedSpeciality
  );

  setFilterDoc(matchedDoctors);

  setMessages([
    ...newMessages,
    { from: "bot", text: `You should consult a ${matchedSpeciality}. Showing you matching doctors.` }
  ]);

  setUserInput("");
};







  

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
     

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-[#E2E5FF] text-black ' : ''}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gastroenterologist</p>
        </div>

        <div className="w-full border p-4 rounded mb-6 max-w-1">
  <div className="h-48 overflow-y-auto mb-2 border p-2 rounded">
    {messages.map((msg, i) => (
      <div key={i} className={`mb-1 ${msg.from === "bot" ? "text-blue-600" : "text-black"}`}>
        <b>{msg.from === "bot" ? "Bot" : "You"}:</b> {msg.text}
      </div>
    ))}
  </div>

  <div className="flex gap-2">
    <input
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      placeholder="Type your problem..."
      className="border px-3 py-2 w-full rounded"
    />
    <button
      onClick={handleSend}
      className="bg-primary text-white px-4 py-2 rounded"
    >
      Send
    </button>
  </div>
</div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-[#EAEFFF]' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors