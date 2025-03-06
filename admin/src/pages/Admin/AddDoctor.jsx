import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const specialities = [
  "General Physician",
  "Cardiologist",
  "Dentist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Psychiatrist",
  "Orthopedic Surgeon",
  "Gynecologist",
  "Oncologist",
];

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [speciality, setSpeciality] = useState(specialities[0]);
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("");
  const [about, setAbout] = useState("");
  const [fees, setFees] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const onFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB!");
      return;
    }

    setDocImg(file);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!docImg) {
      return toast.error("Please upload a doctor image.");
    }

    try {
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: {
          Authorization: `Bearer ${aToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const resetForm = () => {
    setDocImg(null);
    setName("");
    setEmail("");
    setPassword("");
    setSpeciality(specialities[0]);
    setDegree("");
    setExperience("");
    setAbout("");
    setFees("");
    setCity("");
    setState("");
    setCountry("");
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-zinc-900 px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* Doctor Image Upload */}
        <div className="flex items-center gap-4 mb-8 text-white">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload"
            />
          </label>
          <input onChange={onFileChange} type="file" id="doc-img" hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Name</p>
              <input value={name} onChange={(e) => setName(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2" type="text" placeholder="Doctor's Name" required />
            </div>
            <div className="flex flex-col gap-1">
              <p>Email</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2" type="email" placeholder="Email" required />
            </div>
            <div className="flex flex-col gap-1">
              <p>Password</p>
              <input value={password} onChange={(e) => setPassword(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2" type="password" placeholder="Set Password" required />
            </div>
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2">
                {specialities.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <p>Degree</p>
              <input value={degree} onChange={(e) => setDegree(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2" type="text" placeholder="Degree" required />
            </div>
            <div className="flex flex-col gap-1">
              <p>Experience (years)</p>
              <input value={experience} onChange={(e) => setExperience(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2" type="number" placeholder="Experience" required />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>About</p>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2 h-24 resize-none" placeholder="Write about the doctor" required></textarea>
            </div>
            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input value={fees} onChange={(e) => setFees(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2" type="number" placeholder="Consultation Fees" required />
            </div>
            <div className="flex flex-col gap-1">
              <p>City</p>
              <input value={city} onChange={(e) => setCity(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2" type="text" placeholder="City" required />
            </div>
            <div className="flex flex-col gap-1">
              <p>State</p>
              <input value={state} onChange={(e) => setState(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2" type="text" placeholder="State" required />
            </div>
            <div className="flex flex-col gap-1">
              <p>Country</p>
              <input value={country} onChange={(e) => setCountry(e.target.value)} className="border bg-zinc-800 rounded px-3 py-2" type="text" placeholder="Country" required />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">Add Doctor</button>
      </div>
    </form>
  );
};

export default AddDoctor;
