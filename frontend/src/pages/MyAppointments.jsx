import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyAppointments = () => {
  const { token } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");

  // Function to format the date
  const slotDateFormat = (isoDate) => {
    if (!isoDate) return "Invalid Date";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Fetch user appointments
  const getUserAppointments = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        console.error("🚨 No token found! Redirecting to login...");
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/user/appointments",
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.data || !response.data.appointments) {
        console.error("🚨 Appointments data is missing:", response.data);
        setAppointments([]);
        return;
      }

      setAppointments(response.data.appointments.reverse());
    } catch (error) {
      console.error(
        "❌ Error fetching appointments:",
        error.response?.data || error.message
      );
      setAppointments([]);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId, slotDate) => {
    try {
      console.log("🚀 Cancelling appointment:", appointmentId, "Date:", slotDate);

      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        toast.error("Unauthorized: No token found");
        return;
      }

      const { data } = await axios.post(
        "http://localhost:4000/api/user/cancel-appointment",
        { appointmentId, slotDate },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("❌ Axios Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Handle Stripe payment
  const appointmentRazorpay = async (appointmentId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorized: No token found");
            return;
        }

        // ✅ Call Razorpay payment API
        const { data } = await axios.post(
            "http://localhost:4000/api/user/payment-razorpay",
            { appointmentId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
            const { order } = data;

            // ✅ Load Razorpay checkout
            const options = {
                key: "rzp_test_NjTYyIcPKdBVWk", // Replace with your actual Razorpay key ID
                amount: order.amount,
                currency: order.currency,
                name: "Doctor Appointment",
                description: "Payment for your appointment",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            "http://localhost:4000/api/user/verifyRazorpay",
                            { razorpay_order_id: response.razorpay_order_id },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (verifyRes.data.success) {
                            toast.success("Payment Successful");
                            window.location.reload();
                        } else {
                            toast.error("Payment Verification Failed");
                        }
                    } catch (err) {
                        toast.error("Error Verifying Payment");
                        console.error(err);
                    }
                },
                theme: { color: "#528FF0" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error("Razorpay Payment Error:", error);
        toast.error(error.response?.data?.message || error.message);
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
                <img className="w-36 bg-zinc-900" src={item.docData.image} alt="" />
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
                {/* Pay Online Button */}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <>
                    {payment !== item._id ? (
                      <button
                        onClick={() => setPayment(item._id)}
                        className="text-white sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        Pay Online
                      </button>
                    ) : (
                      <button
                        onClick={() => appointmentRazorpay(item._id)}
                        className="text-white sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-zinc-800 transition-all duration-300 flex items-center justify-center"
                      >
                        <img className="max-w-20 max-h-5" src={assets.stripe_logo} alt="Stripe" />
                      </button>
                    )}
                  </>
                )}

                {/* Paid Status */}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]">
                    Paid
                  </button>
                )}

                {/* Completed Status */}
                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                )}

                {/* Cancel Appointment Button */}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id, item.date)}
                    className="text-white sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel appointment
                  </button>
                )}

                {/* Appointment Cancelled Status */}
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
