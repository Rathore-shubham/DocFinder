import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [loading, setLoading] = useState(false);

  // Fetch Doctors Data
  const getDoctorsData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:4000/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch User Profile Data
  const loadUserProfileData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("🚨 No token found in local storage!");
      toast.error("Session expired. Please log in again.");
      return;
    }
  
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/user/get-profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (data.success) {
        setUserData(data.userData); // ✅ Ensure state updates
        localStorage.setItem("userData", JSON.stringify(data.userData));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("🚨 Error fetching user profile:", error);
      toast.error("Failed to load user profile.");
    }
  };
  

  // Load data on mount
  useEffect(() => {
    getDoctorsData();
  }, []);

  // Load user profile when token changes
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
      localStorage.removeItem("userData");
    }
  }, [token]);

  // Update localStorage when token or userData changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    loading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
