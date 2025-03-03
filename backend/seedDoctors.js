import mongoose from "mongoose";
import doctorModel from "./models/doctorModel.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // ✅ Check if file exists
import { v2 as cloudinary } from "cloudinary";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// ✅ Correctly define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadImageToCloudinary = async (fileName) => {
    try {
        const absolutePath = path.join(__dirname, "public", "images", fileName);

        // ✅ Check if file exists
        if (!fs.existsSync(absolutePath)) {
            console.error("❌ File not found:", absolutePath);
            throw new Error("File does not exist at path: " + absolutePath);
        }

        console.log("✅ Uploading file:", absolutePath);

        const result = await cloudinary.uploader.upload(absolutePath, {
            folder: "doctors"
        });

        console.log("✅ Upload Success:", result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error);
        throw new Error("Image upload failed");
    }
};




const doctors = [
    {
        name: "Dr. Arvind Mehta",
        email: "arvind.mehta@example.com",
        password: "password123",
        image: "doc1.png",  
        speciality: "Dermatologist",
        degree: "MBBS, MD (Dermatology)",
        experience: "12 years",
        about: "Specialist in skin treatments and cosmetic dermatology.",
        available: true,
        fees: 900,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            coordinates: { type: "Point", coordinates: [72.8777, 19.0760] }
        },
        date: Date.now()
    },
    {
        name: "Dr. Sneha Kapoor",
        email: "kappor.sneha@example.com",
        password: "password123",
        image: "doc2.png",
        speciality: "Dermatologist",
        degree: "MBBS, MD (Dermatology)",
        experience: "14 years",
        about: "Expert in treating skin conditions, hair loss, and cosmetic procedures.",
        available: true,
        fees: 950,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            coordinates: { type: "Point", coordinates: [72.8777, 19.0760] }
        },
        date: Date.now()
    },
    {
        name: "Dr. Rahul Khanna",
        email: "rahul.khanna@example.com",
        password: "password123",
        image: "doc3.png",
        speciality: "Neurologist",
        degree: "MBBS, DM (Neurology)",
        experience: "20 years",
        about: "Specialist in brain and nervous system disorders.",
        available: true,
        fees: 1500,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            coordinates: { type: "Point", coordinates: [77.1025, 28.7041] }
        },
        date: Date.now()
    },
    {
        name: "Dr. Meera Joshi",
        email: "meera.joshi@example.com",
        password: "password123",
        image: "doc5.png",
        speciality: "Neurologist",
        degree: "MBBS, DM (Neurology)",
        experience: "18 years",
        about: "Specializes in treating stroke, epilepsy, and neurodegenerative diseases.",
        available: true,
        fees: 1450,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            coordinates: { type: "Point", coordinates: [77.1025, 28.7041] }
        },
        date: Date.now()
    },
    {
        name: "Dr. Amit Sinha",
        email: "amit.sinha@example.com",
        password: "password123",
        image: "doc4.png",
        speciality: "Orthopedic Surgeon",
        degree: "MBBS, MS (Orthopedics)",
        experience: "16 years",
        about: "Specialist in joint replacement and sports injuries.",
        available: true,
        fees: 1100,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            coordinates: { type: "Point", coordinates: [77.5946, 12.9716] }
        },
        date: Date.now()
    },
    {
        name: "Dr. Rakesh Malhotra",
        email: "rakesh.malhotra@example.com",
        password: "password123",
        image: "doc6.png",
        speciality: "Pediatrician",
        degree: "MBBS, MD (Pediatrics)",
        experience: "14 years",
        about: "Specialist in child healthcare and development.",
        available: true,
        fees: 1050,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh Nadu",
            country: "India",
            coordinates: { type: "Point", coordinates: [80.2707, 13.0827] }
        },
        date: Date.now()
    },
    {
        name: "Dr. Vikram Rao",
        email: "vikram.rao@example.com",
        password: "password123",
        image: "doc7.png",
        speciality: "ENT Specialist",
        degree: "MBBS, MS (ENT)",
        experience: "15 years",
        about: "Expert in treating ear, nose, and throat disorders.",
        available: true,
        fees: 980,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            coordinates: { type: "Point", coordinates: [78.4867, 17.3850] }
        },
        date: Date.now()
    },
    {
        name: "Dr. Rajesh Bansal",
        email: "rajesh.bansal@example.com",
        password: "password123",
        image: "doc8.png",
        speciality: "ENT Specialist",
        degree: "MBBS, MS (ENT)",
        experience: "13 years",
        about: "Specializes in sinus treatments and hearing disorders.",
        available: true,
        fees: 990,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            coordinates: { type: "Point", coordinates: [78.4867, 17.3850] }
        },
        date: Date.now()
    },
    {
        name: "Dr. Karan Desai",
        email: "karan.desai@example.com",
        password: "password123",
        image: "doc10.png",
        speciality: "General Physician",
        degree: "MBBS, MD (General Medicine)",
        experience: "10 years",
        about: "Expert in treating common illnesses and lifestyle disorders.",
        available: true,
        fees: 750,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            coordinates: { type: "Point", coordinates: [73.8567, 18.5204] }
        },
        date: Date.now()
    },
    {
        name: "Dr. Ananya Sen",
        email: "ananya.sen@example.com",
        password: "password123",
        image: "doc9.png",
        speciality: "General Physician",
        degree: "MBBS, MD (General Medicine)",
        experience: "11 years",
        about: "Provides expert medical advice for various common health concerns.",
        available: true,
        fees: 780,
        slots_booked: {},
        address: {
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            coordinates: { type: "Point", coordinates: [73.8567, 18.5204] }
        },
        date: Date.now()
    },
    
        {
            name: "Dr. Arvind Joshi",
            email: "joshi.mehta@example.com",
            password: "password123",
            image: "doc11.jpg",
            speciality: "Dermatologist",
            degree: "MBBS, MD (Dermatology)",
            experience: "12 years",
            about: "Specialist in skin treatments and cosmetic dermatology.",
            available: true,
            fees: 900,
            slots_booked: {},
            address: {
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [75.8577, 22.7196] }
            },
            date: Date.now()
        },
        {
            name: "Dr. Rajesh Sharma",
            email: "rajesh.sharma@example.com",
            password: "password123",
            image: "doc12.jpg",
            speciality: "General Physician",
            degree: "MBBS, MD (General Medicine)",
            experience: "10 years",
            about: "Expert in treating common illnesses and lifestyle disorders.",
            available: true,
            fees: 750,
            slots_booked: {},
            address: {
                city: "Bhopal",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [77.4126, 23.2599] }
            },
            date: Date.now()
        },
        {
            name: "Dr. Kavita Joshi",
            email: "kavita.joshi@example.com",
            password: "password123",
            image: "doc13.png",
            speciality: "Cardiologist",
            degree: "MBBS, DM (Cardiology)",
            experience: "15 years",
            about: "Specialist in heart diseases and treatments.",
            available: true,
            fees: 1200,
            slots_booked: {},
            address: {
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [75.8577, 22.7196] }
            },
            date: Date.now()
        },
        {
            name: "Dr. Ankur Verma",
            email: "ankur.verma@example.com",
            password: "password123",
            image: "doc14.jpg",
            speciality: "Dentist",
            degree: "BDS, MDS (Oral Surgery)",
            experience: "8 years",
            about: "Expert in dental surgeries and oral hygiene.",
            available: true,
            fees: 600,
            slots_booked: {},
            address: {
                city: "Bhopal",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [77.4126, 23.2599] }
            },
            date: Date.now()
        },
        {
            name: "Dr. Sneha Kapoor",
            email: "kappor@gmail.com",
            password: "password123",
            image: "doc15.jpg",
            speciality: "Neurologist",
            degree: "MBBS, DM (Neurology)",
            experience: "20 years",
            about: "Specialist in brain and nervous system disorders.",
            available: true,
            fees: 1500,
            slots_booked: {},
            address: {
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [75.8577, 22.7196] }
            },
            date: Date.now()
        },
        {
            name: "Dr. Pankaj Tiwari",
            email: "pankaj.tiwari@example.com",
            password: "password123",
            image: "doc16.jpg",
            speciality: "Pediatrician",
            degree: "MBBS, MD (Pediatrics)",
            experience: "14 years",
            about: "Specialist in child healthcare and development.",
            available: true,
            fees: 950,
            slots_booked: {},
            address: {
                city: "Bhopal",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [77.4126, 23.2599] }
            },
            date: Date.now()
        },
        {
            name: "Dr. Ritu Malhotra",
            email: "ritu.malhotra@example.com",
            password: "password123",
            image: "doc17.png",
            speciality: "Psychiatrist",
            degree: "MBBS, MD (Psychiatry)",
            experience: "13 years",
            about: "Expert in mental health and behavioral therapy.",
            available: true,
            fees: 1300,
            slots_booked: {},
            address: {
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [75.8577, 22.7196] }
            },
            date: Date.now()
        },
        {
            name: "Dr. Varun Mishra",
            email: "varun.mishra@example.com",
            password: "password123",
            image: "doc18.jpg",
            speciality: "Orthopedic Surgeon",
            degree: "MBBS, MS (Orthopedics)",
            experience: "18 years",
            about: "Specialist in joint replacement and sports injuries.",
            available: true,
            fees: 1400,
            slots_booked: {},
            address: {
                city: "Bhopal",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [77.4126, 23.2599] }
            },
            date: Date.now()
        },
        {
            name: "Dr. Meenal Deshmukh",
            email: "meenal.deshmukh@example.com",
            password: "password123",
            image: "doc19.jpg",
            speciality: "Gynecologist",
            degree: "MBBS, MD (Gynecology)",
            experience: "16 years",
            about: "Expert in women’s reproductive health and maternity care.",
            available: true,
            fees: 1100,
            slots_booked: {},
            address: {
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [75.8577, 22.7196] }
            },
            date: Date.now()
        },
        {
            name: "Dr. Anjali Rathore",
            email: "anjali.rathore@example.com",
            password: "password123",
            image: "doc20.jpg",
            speciality: "Oncologist",
            degree: "MBBS, DM (Oncology)",
            experience: "22 years",
            about: "Expert in cancer treatments and chemotherapy.",
            available: true,
            fees: 2000,
            slots_booked: {},
            address: {
                city: "Bhopal",
                state: "Madhya Pradesh",
                country: "India",
                coordinates: { type: "Point", coordinates: [77.4126, 23.2599] }
            },
            date: Date.now()
        }
   
];



const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await doctorModel.deleteMany(); // Clear old data

        // Upload each doctor's image to Cloudinary
        for (let doctor of doctors) {
            if (doctor.image) {
                const cloudinaryUrl = await uploadImageToCloudinary(doctor.image);
                doctor.image = cloudinaryUrl;  // Replace local path with Cloudinary URL
            }
        }

        await doctorModel.insertMany(doctors); // Insert new data
        console.log("Doctors inserted successfully with Cloudinary/public images!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error inserting doctors:", error);
        process.exit(1);
    }
};

seedDoctors();
