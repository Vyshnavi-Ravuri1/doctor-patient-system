import AppointmentForm from "../components/AppointmentForm";

function BookAppointment() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f7fb",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: "#ffffff",
                    padding: "28px 24px",
                    borderRadius: "18px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        color: "#1e293b",
                        fontSize: "28px",
                        lineHeight: "1.2",
                    }}
                >
                    Doctor Appointment Booking
                </h1>

                <AppointmentForm />
            </div>
        </div>
    );
}

export default BookAppointment;