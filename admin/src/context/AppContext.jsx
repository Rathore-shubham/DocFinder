import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date (e.g., "20_01_2000" => "20 Jan 2000")
    const slotDateFormat = (slotDate) => {
        if (!slotDate || typeof slotDate !== "string") return "Invalid Date";
    
        let formattedDate;
        
        if (slotDate.includes("_")) {
            // Convert "DD_MM_YYYY" → "YYYY-MM-DD"
            const [day, month, year] = slotDate.split("_").map(Number);
            formattedDate = new Date(`${year}-${month}-${day}`);
        } else {
            formattedDate = new Date(slotDate);
        }
    
        return isNaN(formattedDate.getTime())
            ? "Invalid Date"
            : formattedDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };
    
    
    
    

    // Function to calculate age (e.g., "20_01_2000" => 24)
    const calculateAge = (dob) => {
        if (!dob || typeof dob !== "string") return 0;

        const dateParts = dob.split("_").map(Number);
        if (dateParts.length !== 3 || dateParts.some(isNaN)) return 0;

        const [day, month, year] = dateParts;
        const birthDate = new Date(year, month - 1, day);
        if (isNaN(birthDate.getTime())) return 0; // Ensure valid date

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (
            today.getMonth() < birthDate.getMonth() || 
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
            age--; // Adjust age if birthday hasn't occurred yet
        }
        return age;
    };

    const value = {
        backendUrl,
        currency,
        slotDateFormat,
        calculateAge,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
