# Doctor Appointment Booking System

A full-stack Doctor Appointment Booking System built using React, Node.js, Express, and MongoDB.

## Features

### Patient Side
- Book doctor appointments
- Enter patient details
- Select available date and time slot
- Prevent double booking
- Phone number validation
- Limit same patient to maximum 2 bookings per day

### Doctor Side
- Doctor login with JWT authentication
- View all appointments in dashboard
- Group appointments by:
  - Today's Pending Appointments
  - Upcoming Pending Appointments
  - Completed Consultations
- Open patient detail modal
- Add:
  - Height
  - Weight
  - Temperature
  - Pulse
  - Prescription
- View previous prescriptions using patient phone number
- Delete appointments

## Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

## Project Structure

```text
doctor-patient-system/
  backend/
  frontend/