const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor", doctorRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.log(" DB Error:", err.message));

app.get("/", (req, res) => {
    res.send("Doctor Appointment Backend Running ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});