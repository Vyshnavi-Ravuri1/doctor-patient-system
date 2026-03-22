import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [updateData, setUpdateData] = useState({
        height: "",
        weight: "",
        temperature: "",
        pulse: "",
        prescription: "",
    });

    const navigate = useNavigate();

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("doctorToken");

            const res = await API.get("/appointments/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const sortedAppointments = res.data.data.sort(
                (a, b) => new Date(b.preferredDate) - new Date(a.preferredDate)
            );

            setAppointments(sortedAppointments);
        } catch (error) {
            setMessage("Failed to load appointments");
        }
    };
    const handleSelectAppointment = async (appointment) => {
        setSelectedAppointment(appointment);

        setUpdateData({
            height: appointment.height || "",
            weight: appointment.weight || "",
            temperature: appointment.temperature || "",
            pulse: appointment.pulse || "",
            prescription: appointment.prescription || "",
        });

        try {
            const token = localStorage.getItem("doctorToken");

            const res = await API.get(
                `/appointments/history/${appointment.phoneNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const historyArray = res.data.data || res.data.history || [];

            const filteredHistory = historyArray.filter(
                (item) =>
                    String(item._id) !== String(appointment._id) &&
                    item.prescription &&
                    item.prescription.trim() !== ""
            );

            console.log("Selected phone:", appointment.phoneNumber);
            console.log("History response:", historyArray);
            console.log("Filtered history:", filteredHistory);

            setPatientHistory(filteredHistory);
        } catch (error) {
            console.log("History fetch error:", error);
            setPatientHistory([]);
        }

        setMessage("");
    };
    
    const handleCloseModal = () => {
        setSelectedAppointment(null);
        setPatientHistory([]);
    };

    const handleChange = (e) => {
        setUpdateData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("doctorToken");

            await API.put(`/appointments/${selectedAppointment._id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Appointment details updated successfully");
            handleCloseModal();
            fetchAppointments();
        } catch (error) {
            setMessage("Update failed");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("doctorToken");

            await API.delete(`/appointments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Appointment deleted successfully");
            fetchAppointments();
        } catch (error) {
            setMessage("Delete failed");
        }
    };

    const logout = () => {
        localStorage.removeItem("doctorToken");
        navigate("/doctor-login");
    };

    useEffect(() => {
        const token = localStorage.getItem("doctorToken");

        if (!token) {
            navigate("/doctor-login");
            return;
        }

        fetchAppointments();
    }, []);

    const today = new Date().toISOString().split("T")[0];

    const completedAppointments = appointments.filter(
        (item) => item.prescription && item.prescription.trim() !== ""
    );

    const todayAppointments = appointments.filter(
        (item) =>
            item.preferredDate === today &&
            (!item.prescription || item.prescription.trim() === "")
    );

    const upcomingAppointments = appointments.filter(
        (item) =>
            item.preferredDate > today &&
            (!item.prescription || item.prescription.trim() === "")
    );

    const renderSection = (title, list) => (
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{title}</h2>

            {list.length === 0 ? (
                <p style={styles.emptyText}>No appointments in this section</p>
            ) : (
                <div style={styles.grid}>
                    {list.map((item) => (
                        <div key={item._id} style={styles.card}>
                            <button
                                style={styles.deleteIcon}
                                onClick={() => handleDelete(item._id)}
                                title="Delete Appointment"
                            >
                                🗑
                            </button>

                            <h3 style={styles.cardTitle}>{item.patientName}</h3>
                            <p>
                                <strong>Phone:</strong> {item.phoneNumber}
                            </p>
                            <p>
                                <strong>Date:</strong> {item.preferredDate}
                            </p>
                            <p>
                                <strong>Slot:</strong> {item.preferredTimeSlot}
                            </p>

                            {item.prescription && (
                                <p style={styles.prescriptionTag}>Prescription Added</p>
                            )}

                            <button
                                style={styles.viewBtn}
                                onClick={() => handleSelectAppointment(item)}
                            >
                                View / Update Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>Doctor Dashboard</h1>
                <button style={styles.logoutBtn} onClick={logout}>
                    Logout
                </button>
            </div>

            {message && <p style={styles.message}>{message}</p>}

            {renderSection("Today's Pending Appointments", todayAppointments)}
            {renderSection("Upcoming Pending Appointments", upcomingAppointments)}
            {renderSection("Completed Consultations", completedAppointments)}

            {selectedAppointment && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2 style={{ margin: 0 }}>
                                {selectedAppointment.patientName} - Details
                            </h2>
                            <button style={styles.closeBtn} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>

                        <p>
                            <strong>Phone:</strong> {selectedAppointment.phoneNumber}
                        </p>
                        <p>
                            <strong>Date:</strong> {selectedAppointment.preferredDate}
                        </p>
                        <p>
                            <strong>Slot:</strong> {selectedAppointment.preferredTimeSlot}
                        </p>

                        <form onSubmit={handleUpdate}>
                            <input
                                style={styles.input}
                                type="text"
                                name="height"
                                placeholder="Height"
                                value={updateData.height}
                                onChange={handleChange}
                            />

                            <input
                                style={styles.input}
                                type="text"
                                name="weight"
                                placeholder="Weight"
                                value={updateData.weight}
                                onChange={handleChange}
                            />

                            <input
                                style={styles.input}
                                type="text"
                                name="temperature"
                                placeholder="Temperature"
                                value={updateData.temperature}
                                onChange={handleChange}
                            />

                            <input
                                style={styles.input}
                                type="text"
                                name="pulse"
                                placeholder="Pulse"
                                value={updateData.pulse}
                                onChange={handleChange}
                            />

                            <textarea
                                style={styles.textarea}
                                name="prescription"
                                placeholder="Prescription"
                                value={updateData.prescription}
                                onChange={handleChange}
                            />

                            <button style={styles.saveBtn} type="submit">
                                Save Details
                            </button>
                        </form>

                        <h3 style={styles.historyTitle}>Previous Prescriptions</h3>

                        {patientHistory.length === 0 ? (
                            <p style={styles.emptyText}>No previous prescriptions</p>
                        ) : (
                            patientHistory.map((item) => (
                                <div key={item._id} style={styles.historyCard}>
                                    <p>
                                        <strong>Date:</strong> {item.preferredDate}
                                    </p>
                                    <p>
                                        <strong>Slot:</strong> {item.preferredTimeSlot}
                                    </p>
                                    <p>
                                        <strong>Prescription:</strong> {item.prescription}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px",
    },
    header: {
        maxWidth: "1100px",
        margin: "0 auto 20px auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        margin: 0,
        color: "#1e293b",
    },
    logoutBtn: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    message: {
        maxWidth: "1100px",
        margin: "0 auto 20px auto",
        color: "#0f766e",
        fontWeight: "500",
    },
    section: {
        maxWidth: "1100px",
        margin: "0 auto 30px auto",
    },
    sectionTitle: {
        marginBottom: "14px",
        color: "#1e293b",
    },
    emptyText: {
        color: "#64748b",
        fontStyle: "italic",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
    },
    card: {
        position: "relative",
        background: "#fff",
        borderRadius: "14px",
        padding: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    },
    deleteIcon: {
        position: "absolute",
        top: "12px",
        right: "12px",
        background: "#fee2e2",
        border: "none",
        borderRadius: "50%",
        width: "34px",
        height: "34px",
        cursor: "pointer",
        fontSize: "16px",
    },
    cardTitle: {
        marginTop: 0,
        marginBottom: "12px",
        color: "#1e293b",
        paddingRight: "40px",
    },
    viewBtn: {
        marginTop: "12px",
        width: "100%",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    prescriptionTag: {
        marginTop: "10px",
        color: "#0f766e",
        fontWeight: "600",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 1000,
    },
    modal: {
        width: "100%",
        maxWidth: "520px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#fff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },
    closeBtn: {
        background: "#e2e8f0",
        border: "none",
        padding: "8px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        boxSizing: "border-box",
    },
    textarea: {
        width: "100%",
        minHeight: "100px",
        padding: "12px",
        marginBottom: "12px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        boxSizing: "border-box",
        resize: "vertical",
    },
    saveBtn: {
        width: "100%",
        background: "#0f766e",
        color: "#fff",
        border: "none",
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    historyTitle: {
        marginTop: "24px",
        marginBottom: "14px",
        color: "#1e293b",
    },
    historyCard: {
        background: "#f1f5f9",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "10px",
    },
};
export default DoctorDashboard;