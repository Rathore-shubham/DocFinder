import express from 'express';
import {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    getDoctorsByCity,
    getNearbyDoctors,
    getAppointmentsByDoctor
} from '../controllers/doctorController.js';

import authDoctor from '../middleware/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.get("/list", doctorList);
doctorRouter.post("/change-availability", authDoctor, changeAvailablity);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

// New routes for getting doctors
doctorRouter.get("/doctors/:city", getDoctorsByCity);
doctorRouter.get("/doctors/nearby", getNearbyDoctors);
doctorRouter.post("/doctor/appointments", authDoctor, getAppointmentsByDoctor);

export default doctorRouter;
