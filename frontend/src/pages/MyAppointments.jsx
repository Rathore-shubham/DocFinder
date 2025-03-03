import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyAppointments = () => {
  const { token } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
const slotDateFormat = (isoDate) => {
  if (!isoDate) return "Invalid Date";

  const date = new Date(isoDate); // Convert ISO to JS Date object
  if (isNaN(date.getTime())) return "Invalid Date"; // Check for valid date

  // Format: 03 Mar 2025
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


  
  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {
        const token = localStorage.getItem("token"); // Retrieve the stored token
        if (!token) {
            console.error("🚨 No token found! Redirecting to login...");
            return; // Or redirect to login
        }

        const response = await axios.get(
            "http://localhost:4000/api/user/appointments",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // console.log("✅ Appointments Fetched:", response.data); // 🔥 Debug Log

        if (!response.data || !response.data.appointments) {
            console.error("🚨 Appointments data is missing:", response.data);
            setAppointments([]); // Prevent undefined errors
            return;
        }

        setAppointments(response.data.appointments.reverse());
    } catch (error) {
        console.error(
            "❌ Error fetching appointments:",
            error.response?.data || error.message
        );
        setAppointments([]); // Ensure it's always an array
    }
};


  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId, slotDate) => {
    try {
      console.log("Cancelling appointment with ID:", appointmentId, "Slot Date:", slotDate); // Debug log
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not authenticated");
        return;
      }
  
      const { data } = await axios.post(
        "http://localhost:4000/api/user/cancel-appointment",
        { appointmentId, slotDate }, // ✅ Ensure slotDate is sent
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Server Response:", data); // ✅ Log backend response
  
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Axios Error:", error.response?.data); // ✅ Log error details
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  
  
  

  // Function to make payment using stripe
  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/user/payment-stripe",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-white border-b">
        My Appointments
      </p>

      {appointments.length === 0 ? (
        <p className="text-white text-center mt-6">No Appointments Yet</p>
      ) : (
        <div>
          {appointments.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
            >
              <div>
                <img
                  className="w-36 bg-zinc-900"
                  src={item.docData.image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-white">
                <p className="text-white text-base font-semibold">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="text-white font-medium mt-1">Address:</p>
                <p>{item.docData.address.line1}</p>
                <p>{item.docData.address.line2}</p>
                <p className="mt-1">
                  <span className="text-sm text-white font-medium">
                    Date & Time:
                  </span>{" "}
                  {slotDateFormat(item.date)} | {item.slotTime}
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-end text-sm text-center">
                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  payment !== item._id && (
                    <button
                      onClick={() => setPayment(item._id)}
                      className="text-white sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Pay Online
                    </button>
                  )}
                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  payment === item._id && (
                    <button
                      onClick={() => appointmentStripe(item._id)}
                      className="text-white sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-zinc-800 transition-all duration-300 flex items-center justify-center"
                    >
                      <img
                        className="max-w-20 max-h-5"
                        src={assets.stripe_logo}
                        alt=""
                      />
                    </button>
                  )}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]">
                    Paid
                  </button>
                )}

                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button
                  onClick={() => cancelAppointment(item._id, item.date)}
                    className="text-white sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
