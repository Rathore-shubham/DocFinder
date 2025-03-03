import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        // ✅ FIX: Add `expiresIn`
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // ✅ FIX: Add `expiresIn`
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id; // ✅ Ensure `req.user.id` is used
        // console.log("📥 Received userId:", userId); // Debug log

        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId in request" });
        }

        const user = await userModel.findById(userId).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, userData: user });
    } catch (error) {
        console.error("❌ Server Error in getProfile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



// API to update user profile
const updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, phone, address, dob, gender } = req.body;
      const imageFile = req.file;
  
      if (!name || !phone || !dob || !gender) {
        return res.status(400).json({ success: false, message: "Data Missing" });
      }
  
      const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
      let updateObject = { name, phone, address: parsedAddress, dob, gender };
  
      // ✅ Properly handle image upload
      if (imageFile) {
        const uploadResult = await cloudinary.uploader.upload(imageFile.path);
        updateObject.image = uploadResult.secure_url;
      }
  
      // ✅ Ensure MongoDB updates & returns new data
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateObject,
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User Not Found" });
      }
  
      res.json({ success: true, message: "Profile Updated", user: updatedUser });
  
    } catch (error) {
      console.log("Update Profile Error:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  

  


const bookAppointment = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            console.log("Missing token");
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        let { docId, date, slotTime, amount } = req.body; // ✅ Changed `slotDate` to `date`

        console.log(req.body); // Check if slotDate exists

        if (!req.body.date) {
            return res.status(400).json({ success: false, message: "date is required" });
          }
          
        

        if (!docId || !date || !slotTime || !amount) {
            console.log("Invalid slot data received:", { docId, date, slotTime, amount });
            return res.status(400).json({ success: false, message: "Invalid slot selection." });
        }

        console.log("Received request body:", req.body);

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.error("Invalid date format received:", date);
            return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD." });
        }

        // console.log("Booking appointment with:", { docId, date, slotTime, amount });

        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found." });
        }

        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const newAppointment = new appointmentModel({
            userId: req.userId,
            docId,
            date: new Date(date).toISOString(),      // ✅ Keeping `date` consistent
            slotTime,
            amount,
            docData: doctor,
            userData: user,
        });

        await newAppointment.save();
        console.log("Appointment saved successfully");

        return res.status(201).json({ success: true, message: "Appointment booked successfully!" });
    } catch (error) {
        console.error("Error while booking appointment:", error);
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
};






// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.user.id; // ✅ Get user ID from token

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // ✅ Check if the appointment belongs to the logged-in user
        if (appointmentData.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // ✅ Releasing doctor slot safely
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (!doctorData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        let slots_booked = doctorData.slots_booked || {}; // ✅ Ensure slots_booked exists
        if (!slots_booked[slotDate]) {
            return res.status(400).json({ success: false, message: "Slot date not found" });
        }

        // ✅ Ensure the slotTime exists before filtering
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Cancelled" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const userId = req.user.id || req.userId; // Ensure correct user ID is used
        // console.log("📌 Fetching appointments for user:", userId);

        const appointments = await appointmentModel.find({ userId });

        // console.log("🛠️ Found Appointments:", appointments); // 🔥 Debugging log

        if (!appointments.length) {
            return res.json({ success: true, message: "No Appointments Yet", appointments: [] });
        }

        res.json({ success: true, appointments });
    } catch (error) {
        console.log("❌ Error Fetching Appointments:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe
}