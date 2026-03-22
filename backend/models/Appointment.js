const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patientName: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"],
        },
        preferredDate: {
            type: String,
            required: true,
        },
        preferredTimeSlot: {
            type: String,
            required: true,
        },
        height: {
            type: String,
            default: "",
        },
        weight: {
            type: String,
            default: "",
        },
        temperature: {
            type: String,
            default: "",
        },
        pulse: {
            type: String,
            default: "",
        },
        prescription: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

appointmentSchema.index(
    { preferredDate: 1, preferredTimeSlot: 1 },
    { unique: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);