import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { SenderDashboard } from "./pages/SenderDashboard";
import { CarrierDashboard } from "./pages/CarrierDashboard";
import { SearchCarrier } from "./pages/SearchCarrier";
import { Profile } from "./pages/Profile";
import { Hero } from "./components/Hero";
import Footer from "./components/Footer";
import HowItWorks from "./components/HowItWorks";
import { AddTrip } from "./pages/AddTrip";
import ChatsPage from "./pages/ChatsPage.jsx";
import React from "react";
import Chat from "./pages/Chat.jsx";
import { useEffect } from "react";
import InfoBanner from "./components/InfoBanner.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleLogout = () => {
      navigate("/login");
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 via-teal-200 to-green-200 flex-grow p-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <InfoBanner />
      <Routes>
        <Route path="/join-chat"element={<><Navbar /><Chat /></>}/>
        <Route path="/chat"element={<><Navbar /><ChatsPage /></>}/>
        <Route path="/" element={<><Navbar /><Hero /><div className="mt-16"><HowItWorks /></div></>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sender/dashboard" element={<><Navbar /><SenderDashboard /></>}/>
        <Route path="/carrier/dashboard" element={<><Navbar /><CarrierDashboard /></>}/>
        <Route path="/add-trip" element={<><Navbar /><AddTrip /></>}/>
        <Route path="/search-carrier" element={<><Navbar /><SearchCarrier /></>}/>
        <Route path="/profile"element={<><Navbar /><Profile /></>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
