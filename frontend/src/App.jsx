import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/User/Register'
import HomePage from './Components/User/HomePage'
import Contact from './Components/User/Contact'
import Collections from './Components/User/Collections'
import Cart from './Components/User/Cart'
import AdminDashboard from './Components/Admin/AdminDashboard'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingPolicy from './Components/User/ShippingPolicy'
import PrivacyPolicy from './Components/User/PrivacyPolicy'
import TermsOfService from './Components/User/TermsOfService'
import CareInstructions from './Components/User/CareInstructions'
import ReturnExchange from './Components/User/ReturnExchange'
import Profile from './Components/User/Profile'

export default function App() {
  return (
    <>
    <Routes>
      {/* --------LOGIN & Register-------- */}
      <Route path='/Login' element={<Login/>} />
      <Route path='/Register' element={<Register/>}/>
     

      {/* ----------------USER-------------- */}
      <Route path='/' element={<HomePage/>}/>
      <Route path='/Contact' element={<Contact/>}/>
      <Route path='/Collections' element={<Collections/>}/>
      <Route path='/Cart' element={<Cart/>}/>
      <Route path='/ShippingPolicy' element={<ShippingPolicy/>}/>
      <Route path='/PrivacyPolicy' element={<PrivacyPolicy/>}/>
      <Route path='/Termsofservice' element={<TermsOfService/>}/>
      <Route path='/CareInstructions' element={<CareInstructions/>}/>
      <Route path="/return-exchange" element={<ReturnExchange />} />
      <Route path="/Profile" element={<Profile />} />
     
     
    {/* ---------ADMIN------------ */}
    <Route path='/Adminhome' element={<AdminDashboard/>}/>

    </Routes>
     <ToastContainer position="top-right" autoClose={2000} />
    </>
  )
}
