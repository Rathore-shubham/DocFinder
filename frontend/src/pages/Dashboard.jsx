import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Chatbot from "../components/Chatbot";  // ✅ Import Chatbot Component

const Dashboard = () => {
  const { token, userData, setUserData, setToken } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      loadAppointments();
    }
  }, [token]);

  // Load Appointments
  const loadAppointments = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/user/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load appointments.");
    }
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserData(null);
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-zinc-800 text-white rounded-lg shadow-lg relative">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* User Info */}
      {userData ? (
        <div className="mb-6">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
        </div>
      ) : (
        <p className="text-red-400">Error loading user data</p>
      )}

      {/* Appointments */}
      <h2 className="text-xl font-semibold mb-3">My Appointments</h2>
      {appointments.length > 0 ? (
        <ul className="space-y-3">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="p-3 bg-gray-700 rounded-lg">
              <p><strong>Doctor:</strong> {appointment.doctorName}</p>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments found.</p>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>

      {/* ✅ Add Chatbot Here */}
      <Chatbot />

    </div>
  );
};

export default Dashboard;
