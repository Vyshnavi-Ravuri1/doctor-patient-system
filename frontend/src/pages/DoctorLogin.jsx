import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function DoctorLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/doctor/login", formData);
            localStorage.setItem("doctorToken", res.data.token);
            navigate("/doctor-dashboard");
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <h2 style={styles.title}>Doctor Login</h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        style={styles.input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button style={styles.button} type="submit">
                        Login
                    </button>

                    {message && (
                        <p style={styles.error}>{message}</p>
                    )}
                </form>

            </div>
        </div>
    );
}

const styles = {
    page: {
        height: "100vh",
        background: "#fafafa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        width: "100%",
        maxWidth: "350px",
        background: "white",
        padding: "40px 30px",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        textAlign: "center",
    },

    title: {
        marginBottom: "25px",
        fontSize: "26px",
        color: "#262626",
        fontWeight: "600",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },

    input: {
        padding: "12px",
        border: "1px solid #dbdbdb",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        background: "#fafafa",
    },

    button: {
        marginTop: "8px",
        padding: "12px",
        background: "#0095f6",
        border: "none",
        borderRadius: "8px",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "15px",
    },

    error: {
        color: "red",
        marginTop: "10px",
        fontSize: "14px",
    },
};

export default DoctorLogin;