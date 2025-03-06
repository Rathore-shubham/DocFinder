import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const fetchDoctorsByLocation = async () => {
    if (!location.trim()) {
      setFilteredDoctors([]);
      return;
    }

    setSearching(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctors/by-city?city=${location}`);
      setFilteredDoctors(data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>

      {/* Location Filter Input */}
      {/* <div className="flex gap-2 mt-3">
        <input
          type="text"
          className="border p-2 rounded bg-zinc-800 text-white"
          placeholder="Search by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={fetchDoctorsByLocation}
          className="bg-primary px-4 py-2 rounded text-white"
          disabled={searching}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div> */}

      {/* Doctors List */}
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {(filteredDoctors.length > 0 ? filteredDoctors : doctors).map((doctor, index) => (
          <div
            className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group bg-gray-800 p-4 text-white"
            key={index}
          >
            <img
              className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-32 object-cover rounded-md"
              src={doctor.image || '/default-doctor.png'}
              alt={doctor.name}
            />

            <div className="mt-3">
              <p className="text-lg font-semibold">{doctor.name}</p>
              <p className="text-sm text-gray-300">{doctor.speciality}</p>
              <p className="text-sm text-gray-400">{doctor.location}</p>

              <div className="mt-2">
                <p className="text-sm"><strong>Experience:</strong> {doctor.experience} years</p>
                <p className="text-sm"><strong>Fee:</strong> ₹{doctor.fee}</p>
                <p className="text-sm"><strong>Rating:</strong> ⭐ {doctor.rating || 'N/A'}</p>
              </div>

              {/* Availability Toggle */}
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input onChange={() => changeAvailability(doctor._id)} type="checkbox" checked={doctor.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
