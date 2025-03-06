import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Sign token correctly with an object payload
            const token = jwt.sign(
                { email }, // Payload should be an object
                process.env.JWT_SECRET,
                { expiresIn: "1h" } // Optional: Token expiry
            );

            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({}, "-__v");

        const formattedAppointments = appointments.map(appointment => {
            let formattedDate;
            
            if (appointment.date.includes("_")) {
                // Convert "DD_MM_YYYY" → "YYYY-MM-DD"
                const [day, month, year] = appointment.date.split("_").map(Number);
                formattedDate = new Date(`${year}-${month}-${day}`);
            } else {
                // Assume it's already in "YYYY-MM-DD" or similar
                formattedDate = new Date(appointment.date);
            }

            return {
                ...appointment._doc,
                date: isNaN(formattedDate.getTime())
                    ? "Invalid Date"
                    : formattedDate.toLocaleDateString("en-GB", { 
                        day: "2-digit", 
                        month: "short", 
                        year: "numeric" 
                    }),
            };
        });

        res.json({ success: true, appointments: formattedAppointments });

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};






// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, city, state, country } = req.body;
        const imageFile = req.file;

        // ✅ Validate all required fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !city || !state || !country) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // ✅ Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // ✅ Validate strong password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Upload image to Cloudinary
        let imageUrl = "";
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        // ✅ Construct doctor object
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: {
                city,
                state,
                country,
            },
        };

        // ✅ Save to database
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();
        res.status(201).json({ success: true, message: "Doctor added successfully" });
    } catch (error) {
        console.error("Error in addDoctor:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};




// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard
}