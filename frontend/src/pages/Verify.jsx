import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") || "false";
  const appointmentId = searchParams.get("appointmentId");

  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!appointmentId) {
      console.error("❌ appointmentId is missing from URL");
      navigate("/my-appointments");  // Redirect if no appointment ID
      return;
    }

    const verifyStripe = async () => {
      try {
        console.log("🔍 Verifying Stripe payment...", { success, appointmentId });

        const { data } = await axios.post(
          `${backendUrl}/api/user/verifyStripe`,
          { success, appointmentId },
          { headers: { token } }
        );

        console.log("✅ API Response:", data);

        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }

        navigate("/my-appointments");
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
        console.error("❌ API Error:", error);
      }
    };

    verifyStripe();
  }, [token, appointmentId, success, backendUrl, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Verify;
