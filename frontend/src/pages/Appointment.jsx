import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets.js"; // Adjust path as needed

import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, token, getDoctorsData, userData } =
    useContext(AppContext);
  const navigate = useNavigate();

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch doctor info
  const fetchDocInfo = useCallback(() => {
    const doc = doctors.find((doc) => doc._id === docId);
    if (doc) {
      setDocInfo(doc);
    }
  }, [doctors, docId]);

  // Get available slots
  const getAvailableSlots = useCallback(() => {
    if (!docInfo || !docInfo.slots_booked) return;

    let today = new Date();
    let slotsArray = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let slotDate = `${currentDate.getDate()}_${
          currentDate.getMonth() + 1
        }_${currentDate.getFullYear()}`;

        const isSlotAvailable = !(
          docInfo.slots_booked[slotDate] || []
        ).includes(formattedTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      slotsArray.push(timeSlots);
    }

    setDocSlots(slotsArray);
  }, [docInfo]);

  // Book Appointment
  const bookAppointment = async () => {
    try {
      if (!docSlots?.[slotIndex]?.length || !slotTime) {
        toast.error("Please select a valid slot date and time.");
        return;
      }
  
      if (!docInfo) {
        toast.error("Doctor information is missing.");
        return;
      }
  
      console.log("Selected Slot Details:", docSlots[slotIndex]);
  
      if (!docSlots?.[slotIndex][0]?.datetime) {
        console.error("Invalid slot data:", docSlots);
        toast.error("Invalid slot selection. Please select a valid slot.");
        return;
      }
  
      const slotDateObj = new Date(docSlots[slotIndex][0].datetime);
      if (isNaN(slotDateObj.getTime())) {
        console.error("Invalid slot date:", docSlots[slotIndex][0].datetime);
        toast.error("Invalid slot date. Please select a valid date.");
        return;
      }
      
      const date = slotDateObj.toISOString().split("T")[0]; // ✅ Use `date` instead of `slotDate`
  
      // console.log("Booking appointment with:", { docId, date, slotTime });
  
      const amount = docInfo?.fee || 500;
  
      // console.log("Payload being sent:", { docId, date, slotTime, amount });
  
      if (!token) {
        toast.error("User not authenticated. Please log in again.");
        console.error("Missing authentication token.");
        return;
      }
  
      const { data } = await axios.post(
        "http://localhost:4000/api/user/book-appointment",
        { docId, date, slotTime, amount }, // ✅ Updated `slotDate` to `date`
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error while booking appointment:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };
  
  

  // Fetch data on mount
  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
      setLoading(false);
    }
  }, [doctors, fetchDocInfo]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo, getAvailableSlots]);

  if (loading) return <p>Loading...</p>;

  return docInfo ? (
    <div className="pt-20 sm:pt-24">
      {" "}
      {/* Add padding to avoid overlap */}
      {/* ---------- Doctor Details ----------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt=""
          />
        </div>

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-zinc-900 text-white mx-2 sm:mx-0 mt-4 sm:mt-0">
          {/* ----- Doc Info : name, degree, experience ----- */}
          <p className="flex items-center gap-2 text-3xl font-medium text-white">
            {docInfo.name}{" "}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-white">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>

          {/* ----- Doc About ----- */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-white mt-3">
              About{" "}
              <img className="w-3 bg-white " src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-white max-w-[700px] mt-1">
              {docInfo.about}
            </p>
          </div>

          {/* ----- Address Section ----- */}
          <div className="mt-3">
            <p className="flex items-center gap-1 text-sm font-medium text-white">
              Address{" "}
              <img className="w-4 bg-white" src={assets.location_icon} alt="" />
            </p>
            <p className="text-sm text-white max-w-[700px] mt-1">
              {docInfo.address.city}, {docInfo.address.state},{" "}
              {docInfo.address.country}
            </p>
          </div>

          <p className="text-white font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-white">
              {currencySymbol}
              {docInfo.fees}
            </span>{" "}
          </p>
        </div>
      </div>
      {/* Booking slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-white">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length &&
            docSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                key={index}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-primary text-white"
                    : "border border-[#DDDDDD]"
                }`}
              >
                <p>
                  {item[0] &&
                    daysOfWeek[new Date(item[0].datetime + "Z").getDay()]}
                </p>

                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length &&
            docSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? "bg-primary text-white"
                    : "text-white border border-[#B4B4B4]"
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>
      {/* Listing Related Doctors */}
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : null;
};

export default Appointment;
