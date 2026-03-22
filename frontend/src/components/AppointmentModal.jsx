import React from "react";

function AppointmentModal({
    selectedAppointment,
    updateData,
    setUpdateData,
    handleUpdate,
    closeModal,
    patientHistory,
}) {
    if (!selectedAppointment) return null;

    return (
        <div style={overlay}>
            <div style={modal}>
                <button style={closeBtn} onClick={closeModal}>
                    ✕
                </button>

                <h2>{selectedAppointment.patientName} - Details</h2>

                <p>
                    <strong>Phone:</strong> {selectedAppointment.phoneNumber}
                </p>
                <p>
                    <strong>Date:</strong> {selectedAppointment.preferredDate}
                </p>
                <p>
                    <strong>Slot:</strong> {selectedAppointment.preferredTimeSlot}
                </p>

                <input
                    placeholder="Height"
                    value={updateData.height}
                    onChange={(e) =>
                        setUpdateData({ ...updateData, height: e.target.value })
                    }
                    style={input}
                />

                <input
                    placeholder="Weight"
                    value={updateData.weight}
                    onChange={(e) =>
                        setUpdateData({ ...updateData, weight: e.target.value })
                    }
                    style={input}
                />

                <input
                    placeholder="Temperature"
                    value={updateData.temperature}
                    onChange={(e) =>
                        setUpdateData({ ...updateData, temperature: e.target.value })
                    }
                    style={input}
                />

                <input
                    placeholder="Pulse"
                    value={updateData.pulse}
                    onChange={(e) =>
                        setUpdateData({ ...updateData, pulse: e.target.value })
                    }
                    style={input}
                />

                <textarea
                    placeholder="Prescription"
                    value={updateData.prescription}
                    onChange={(e) =>
                        setUpdateData({ ...updateData, prescription: e.target.value })
                    }
                    style={textarea}
                />

                <button style={saveBtn} onClick={handleUpdate}>
                    Save Details
                </button>

                <h3 style={{ marginTop: 20 }}>Previous Prescriptions</h3>

                {patientHistory.length === 0 ? (
                    <p>No previous prescriptions</p>
                ) : (
                    patientHistory.map((item) => (
                        <div key={item._id} style={historyCard}>
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
    );
}

export default AppointmentModal;

/* ===== styles ===== */

const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
};

const modal = {
    background: "white",
    padding: 25,
    borderRadius: 10,
    width: 420,
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
};

const closeBtn = {
    position: "absolute",
    right: 10,
    top: 10,
    border: "none",
    background: "#eee",
    padding: "4px 10px",
    cursor: "pointer",
    borderRadius: 6,
};

const input = {
    width: "100%",
    padding: 10,
    marginTop: 10,
};

const textarea = {
    width: "100%",
    padding: 10,
    marginTop: 10,
    minHeight: 80,
};

const saveBtn = {
    marginTop: 15,
    width: "100%",
    padding: 12,
    background: "#1e7e34",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
};

const historyCard = {
    background: "#f4f4f4",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
};