import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Verify from './pages/Verify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Chatbot from './components/Chatbot'

const App = () => {
  return (
    <div className='bg-zinc-900 pl-6 pr-6 text-white '>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/doctors' element={<Doctors />}/>
        <Route path='/doctors/:speciality' element={< Doctors/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/my-profile' element={<MyProfile />}/>
        <Route path='/my-appointments' element={<MyAppointments />}/>
        <Route path='/appointment/:docId' element={<Appointment />}/>
        <Route path='/verify' element={<Verify />} />
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
      <Chatbot />
      <Footer />
    </div>
  )
}

export default App