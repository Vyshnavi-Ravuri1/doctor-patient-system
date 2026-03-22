import axios from "axios";

const API = axios.create({
    baseURL: "https://doctor-patient-system.onrender.com/api",
});

export default API;