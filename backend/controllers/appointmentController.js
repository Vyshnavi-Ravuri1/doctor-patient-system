const Appointment = require("../models/Appointment");

// Create Appointment
const createAppointment = async (req, res) => {
    try {
        const {
            patientName,
            phoneNumber,
            age,
            gender,
            preferredDate,
            preferredTimeSlot,
        } = req.body;

        if (
            !patientName ||
            !phoneNumber ||
            !age ||
            !gender ||
            !preferredDate ||
            !preferredTimeSlot
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(normalizedPhone)) {
            return res.status(400).json({
                success: false,
                message: "Enter valid 10 digit phone number",
            });
        }

        // limit same patient to max 2 bookings per day
        const sameDayBookings = await Appointment.countDocuments({
            phoneNumber: normalizedPhone,
            preferredDate,
        });

        if (sameDayBookings >= 2) {
            return res.status(400).json({
                success: false,
                message: "Only 2 appointments per day are allowed for one patient",
            });
        }

        const appointment = new Appointment({
            patientName,
            phoneNumber: normalizedPhone,
            age,
            gender,
            preferredDate,
            preferredTimeSlot,
        });

        await appointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment Booked Successfully",
            data: appointment,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "This time slot is already booked",
            });
        }

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Get All Appointments
const getAppointments = async (req, res) => {
    try {
        const data = await Appointment.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching appointments",
        });
    }
};

// Get Patient History
const getPatientHistory = async (req, res) => {
    try {
        const { phoneNumber } = req.params;

        const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

        const history = await Appointment.find().sort({ createdAt: -1 });

        const filteredHistory = history.filter((item) => {
            const itemPhone = String(item.phoneNumber || "")
                .replace(/\D/g, "")
                .slice(-10);

            return itemPhone === normalizedPhone;
        });

        res.json({
            success: true,
            data: filteredHistory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching patient history",
        });
    }
};

// Update Appointment
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { height, weight, temperature, pulse, prescription } = req.body;

        const updated = await Appointment.findByIdAndUpdate(
            id,
            {
                height,
                weight,
                temperature,
                pulse,
                prescription,
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        res.json({
            success: true,
            message: "Appointment Updated",
            data: updated,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating appointment",
        });
    }
};

// Get Available Slots
const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.params;

        const allSlots = [
            "10:00 AM",
            "10:30 AM",
            "11:00 AM",
            "11:30 AM",
            "12:00 PM",
            "02:00 PM",
            "02:30 PM",
            "03:00 PM",
            "03:30 PM",
            "04:00 PM",
        ];

        const bookedAppointments = await Appointment.find(
            { preferredDate: date },
            { preferredTimeSlot: 1, _id: 0 }
        );

        const bookedSlots = bookedAppointments.map((item) =>
            String(item.preferredTimeSlot).trim()
        );

        const availableSlots = allSlots.filter(
            (slot) => !bookedSlots.includes(slot)
        );

        res.json({
            success: true,
            date,
            bookedSlots,
            availableSlots,
        });
    } catch (error) {
        console.log("Slot error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching slot availability",
        });
    }
};

// Delete Appointment
const deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Appointment Deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getPatientHistory,
    updateAppointment,
    getAvailableSlots,
    deleteAppointment,
};