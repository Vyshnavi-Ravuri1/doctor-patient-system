const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor", doctorRoutes);

app.get("/", (req, res) => {
    res.send("Doctor Appointment Backend Running ");
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("DB Error:", err.message);
        process.exit(1);
    });