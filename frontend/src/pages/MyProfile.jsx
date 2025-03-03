import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const { token, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);

  // Ensure userData and address are always defined to prevent errors
  const user =
    userData && userData.address
      ? userData
      : {
          name: "",
          phone: "",
          email: "",
          gender: "Not Selected",
          dob: "",
          image: "",
          address: { line1: "", line2: "" },
        };

        const updateUserProfileData = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              toast.error("User not authenticated");
              return;
            }
        
            if (!userData?.name || !userData?.phone || !userData?.dob || !userData?.gender) {
              toast.error("Please fill all required fields.");
              return;
            }
        
            const formData = new FormData();
            formData.append("name", userData?.name);
            formData.append("phone", userData?.phone);
            formData.append("gender", userData?.gender);
            formData.append("dob", userData?.dob);
            formData.append("address", JSON.stringify(userData?.address || {}));
            if (image) formData.append("image", image);
        
            const { data } = await axios.post(
              `http://localhost:4000/api/user/update-profile`,
              formData,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
        
            if (data.success) {
              toast.success("Profile updated successfully!");
              
              console.log("📢 API Response:", data.user); // Debugging
        
              // ✅ Set user data manually to force update
              setUserData((prev) => ({
                ...prev,
                ...data.user, // Merge previous data with updated data
              }));
        
              setIsEdit(false);
              setImage(null);
            } else {
              toast.error(data.message);
            }
          } catch (error) {
            console.error("Profile Update Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Something went wrong");
          }
        };
        
        
        
        useEffect(() => {
          console.log("🔄 User Data Updated:", userData);
        }, [userData]);
      
        useEffect(() => {
          loadUserProfileData();
        }, []); 
        

  return (
    <div className="relative max-w-lg flex flex-col gap-2 text-sm pt-5 mt-20">
    {isEdit ? (
      <label htmlFor="image">
        <div className="inline-block relative cursor-pointer">
          <img
            className="w-36 rounded opacity-75"
            src={image ? URL.createObjectURL(image) : userData?.image}
            alt="Profile"
          />
          <img
            className="bg-zinc-900 w-12 absolute bottom-2 right-2 hover:bg-slate-400 transition-all duration-500"
            src={image ? "" : assets.upload_icon}
            alt="Upload"
          />
        </div>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          hidden
        />
      </label>
    ) : (
      <img className="w-36 rounded" src={userData?.image} alt="Profile" />
    )}

    {isEdit ? (
      <input
        className="bg-zinc-900 text-3xl font-medium max-w-60"
        type="text"
        onChange={(e) =>
          setUserData((prev) => ({ ...prev, name: e.target.value }))
        }
        value={userData?.name || ""}
      />
    ) : (
      <p className="font-medium text-3xl text-white mt-4">{userData?.name}</p>
    )}

    <hr className="bg-[#ADADAD] h-[1px] border-none" />

    <div>
      <p className="text-white underline mt-3">CONTACT INFORMATION</p>
      <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 bg-zinc-700 p-3 rounded-lg text-white">
        <p className="font-medium">Email id:</p>
        <p className="text-blue-400">{userData?.email || "No email available"}</p>


        <p className="font-medium">Phone:</p>
        {isEdit ? (
          <input
            className="bg-zinc-900 max-w-48 p-1 rounded"
            type="text"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, phone: e.target.value }))
            }
            value={userData?.phone || ""}
          />
        ) : (
          <p className="text-white">{userData?.phone}</p>
        )}

        <p className="font-medium">Address:</p>
        {isEdit ? (
          <div>
            <input
              className="bg-zinc-900 max-w-52 p-1 rounded"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev?.address, line1: e.target.value },
                }))
              }
              value={userData?.address?.line1 || ""}
            />
            <br />
            <input
              className="bg-zinc-900 mt-2 max-w-52 p-1 rounded"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev?.address, line2: e.target.value },
                }))
              }
              value={userData?.address?.line2 || ""}
            />
          </div>
        ) : (
          <p className="text-white">
            {userData?.address?.line1 || "No address available"} <br />{" "}
            {userData?.address?.line2 || ""}
          </p>
        )}
      </div>
    </div>

    <div>
      <p className="text-white underline mt-3">BASIC INFORMATION</p>
      <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-white">
        <p className="font-medium">Gender:</p>
        {isEdit ? (
          <select
            className="max-w-20 bg-zinc-900 text-white"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, gender: e.target.value }))
            }
            value={userData?.gender || "Not Selected"}
          >
            <option value="Not Selected">Not Selected</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        ) : (
          <p className="text-white">{userData?.gender}</p>
        )}

        <p className="font-medium">Birthday:</p>
        {isEdit ? (
          <input
            className="max-w-28 bg-zinc-900"
            type="date"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, dob: e.target.value }))
            }
            value={userData?.dob || ""}
          />
        ) : (
          <p className="text-white">{userData?.dob}</p>
        )}
      </div>
    </div>

    <div className="mt-10">
      {isEdit ? (
        <button
          onClick={() => {
            updateUserProfileData(userData);
            setIsEdit(false);
          }}
          className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
        >
          Save information
        </button>
      ) : (
        <button
        onClick={() => setIsEdit(true)}

          className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
        >
          Edit
        </button>
      )}
    </div>
  </div>
  );
};

export default MyProfile;
