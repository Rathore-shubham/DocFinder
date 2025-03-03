import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { doctors, loading, setDoctors } = useContext(AppContext);

  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCityChange = async (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/doctors?city=${selectedCity}`);
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
    setIsLoading(false);
  };

  const applyFilter = () => {
    let filtered = doctors;
    if (speciality) {
      filtered = filtered.filter((doc) => doc.speciality === speciality);
    }
    if (city) {
      filtered = filtered.filter((doc) => doc.address.city === city);
    }
    setFilterDoc(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, city]);

  return (
    <div>
      <p className='text-white'>Browse through the doctors specialist.</p>

      {/* City Filter Dropdown */}
      <div className="mt-4">
        <label className="text-white mr-2">Filter by City:</label>
        <select
          value={city}
          onChange={handleCityChange}
          className="p-2 border rounded bg-white text-black"
        >
          <option value="">Select City</option>
          <option value="Indore">Indore</option>
          <option value="Bhopal">Bhopal</option>
          <option value="Mumbai">Mumbai</option>
        </select>
      </div>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>
          Filters
        </button>
        
        <div className={`flex-col gap-4 text-sm text-white ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {[ 'General Physician', 'Gynecologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Gastroenterologist'].map((spec) => (
            <p key={spec} onClick={() => (speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`))}
               className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === spec ? 'bg-[#E2E5FF] text-black' : ''}`}>
              {spec}
            </p>
          ))}
        </div>

        <>
          {loading || isLoading ? (
            <div className='w-full flex justify-center'>
              <h5 className='text-center mt-10'>
                <BarLoader color="#5f6FFF" />
              </h5>
            </div>
          ) : (
            <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
              {filterDoc.length > 0 ? (
                filterDoc.map((item, index) => (
                  <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }}
                       className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                    <img className='bg-[#EAEFFF]' src={item.image} alt="" />
                    <div className='p-4'>
                      <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                        <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
                        <p>{item.available ? 'Available' : "Not Available"}</p>
                      </div>
                      <p className='text-white text-lg font-medium'>{item.name}</p>
                      <p className='text-white text-sm'>{item.speciality}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-white text-center mt-10'>No doctors available</p>
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Doctors;
