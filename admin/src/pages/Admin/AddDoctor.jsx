import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

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
    "Oncologist"
];

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState(specialities[0]);
    const [degree, setDegree] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [location, setLocation] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);

    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    const fetchLocationSuggestions = async (input) => {
        if (input.length < 2) {
            setLocationSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=YOUR_GOOGLE_API_KEY`
            );
            const data = await response.json();

            if (data.status === "OK") {
                setLocationSuggestions(data.predictions.map(prediction => prediction.description));
            } else {
                setLocationSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
            setLocationSuggestions([]);
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!docImg) {
            return toast.error('Please upload a doctor image.');
        }

        try {
            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
            formData.append('location', location);

            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
                headers: { aToken },
            });

            if (data.success) {
                toast.success(data.message);
                resetForm();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    const resetForm = () => {
        setDocImg(null);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('');
        setFees('');
        setAbout('');
        setSpeciality(specialities[0]);
        setDegree('');
        setAddress1('');
        setAddress2('');
        setLocation('');
        setLocationSuggestions([]);
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
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
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
                    </div>

                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <p>Location</p>
                            <input value={location} onChange={(e) => { setLocation(e.target.value); fetchLocationSuggestions(e.target.value); }} className="border bg-zinc-800 rounded px-3 py-2" type="text" placeholder="Enter Location" required />
                            {locationSuggestions.length > 0 && (
                                <ul className="bg-white border mt-1 rounded shadow-md absolute w-full">
                                    {locationSuggestions.map((suggestion, index) => (
                                        <li key={index} className="px-3 py-2 cursor-pointer hover:bg-gray-200" onClick={() => { setLocation(suggestion); setLocationSuggestions([]); }}>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">Add Doctor</button>
            </div>
        </form>
    );
};

export default AddDoctor;
