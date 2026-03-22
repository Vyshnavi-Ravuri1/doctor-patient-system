import { useState } from "react";
import API from "../services/api";

function AppointmentForm() {
    const [formData, setFormData] = useState({
        patientName: "",
        phoneNumber: "",
        age: "",
        gender: "",
        preferredDate: "",
        preferredTimeSlot: "",
    });

    const [availableSlots, setAvailableSlots] = useState([]);
    const [message, setMessage] = useState("");

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;

        setFormData((prev) => ({
            ...prev,
            preferredDate: selectedDate,
            preferredTimeSlot: "",
        }));

        try {
            const res = await API.get(`/appointments/slots/${selectedDate}`);
            setAvailableSlots(res.data.availableSlots);
            setMessage("");
        } catch (error) {
            setAvailableSlots([]);
            setMessage("Could not load slots");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePhone(formData.phoneNumber)) {
            setMessage("Enter valid 10 digit phone number");
            return;
        }

        if (!formData.preferredTimeSlot) {
            setMessage("Please select time slot");
            return;
        }

        try {
            const res = await API.post("/appointments/book", formData);
            setMessage(res.data.message);

            setFormData({
                patientName: "",
                phoneNumber: "",
                age: "",
                gender: "",
                preferredDate: "",
                preferredTimeSlot: "",
            });

            setAvailableSlots([]);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
    };

    const buttonStyle = {
        width: "100%",
        padding: "12px",
        background: "#0f766e",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontSize: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: "6px",
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                style={inputStyle}
                type="text"
                name="patientName"
                placeholder="Patient Name"
                value={formData.patientName}
                onChange={handleChange}
                required
            />

            <input
                style={inputStyle}
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={10}
                required
            />

            <input
                style={inputStyle}
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
            />

            <select
                style={inputStyle}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
            >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>

            <input
                style={inputStyle}
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleDateChange}
                required
            />

            <select
                style={inputStyle}
                name="preferredTimeSlot"
                value={formData.preferredTimeSlot}
                onChange={handleChange}
                required
            >
                <option value="">Select Time Slot</option>

                {availableSlots.length === 0 ? (
                    <option disabled>No Slots Available</option>
                ) : (
                    availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                            {slot}
                        </option>
                    ))
                )}
            </select>

            <button style={buttonStyle} type="submit">
                Book Appointment
            </button>

            {message && (
                <p
                    style={{
                        marginTop: "14px",
                        textAlign: "center",
                        color: message.includes("Success") ? "green" : "#b91c1c",
                        fontWeight: "500",
                    }}
                >
                    {message}
                </p>
            )}
        </form>
    );
}

export default AppointmentForm;