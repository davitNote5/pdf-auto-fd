import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../components/Header"; 
import axios from 'axios';

function FormPage() {
  const navigate = useNavigate();
  
  // Redirect to sign-in page if the user is not logged in
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const [snName, setSnName] = useState();
  const [action, setAction] = useState("Discharge");
  const [appointmentDates, setAppointmentDates] = useState(Array(9).fill("2025-04-01"));
  const [appointmentTimes, setAppointmentTimes] = useState(Array(9).fill("12:00"));
  const [resetDate, setResetDate] = useState("2025-04-01");
  const [resetTime, setResetTime] = useState("12:00");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);  

  const handleDateChange = (index, value) => {
    const newDates = [...appointmentDates];
    newDates[index] = value;
    setAppointmentDates(newDates);
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...appointmentTimes];
    newTimes[index] = value;
    setAppointmentTimes(newTimes);
  };

  // Dynamically update appointmentDates and appointmentTimes based on action
  useEffect(() => {
    if (action === "Discharge") {
      setAppointmentDates(Array(10).fill("2025-04-01"));
      setAppointmentTimes(Array(10).fill("12:00"));
    } else {
      setAppointmentDates(Array(9).fill("2025-04-01"));
      setAppointmentTimes(Array(9).fill("12:00"));
    }
  }, [action]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!snName) {
      alert("Please enter SN Name.");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a PDF.");
      return;
    }
    if (appointmentDates.includes("") || appointmentTimes.includes("")) {
      alert("Please fill all appointment dates and times.");
      return;
    }

    try {
      setLoading(true);  // ✅ Start loading

      // Create the data to be sent to the backend (without extraction result for now)
      const formData = new FormData();
      formData.append("action", action);
      formData.append("sn_name", snName);
      formData.append("appointment_dates", JSON.stringify(appointmentDates));
      formData.append("appointment_times", JSON.stringify(appointmentTimes));
      formData.append("file", selectedFile); // Append the PDF file

      const response = await axios.post("https://pdf-auto-bd-6yf5.onrender.com/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Extracted Data:", response.data);

      navigate("/runDisease", { state: { extractedData: response.data } });

    } catch (error) {
      console.error(error);
      alert("Failed to process the PDF. Please try again.");
    } finally {
      setLoading(false);  // ✅ Stop loading
    }
  };

  const getOrdinal = (n) => {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return `${n}th`;
  };

  return (
    <div className="bg-light" style={{ height: '100vh' }}>
      <Header backgroundColor="#00308F"/>
      <div className="container py-5 position-relative">
        <div className="card p-5 shadow-lg" style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.5 : 1 }}>
          <h1 className="text-center mb-4">Input Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">SN Name</label>
              <input
                type="text"
                className="form-control"
                value={snName}
                onChange={(e) => setSnName(e.target.value)}
                placeholder="Enter SN Name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Select Action</label>
              <select
                className="form-select"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="Discharge">Discharge</option>
                <option value="Reset">Reset</option>
              </select>
            </div>

            <h4 className="mt-4">Enter Appointment Dates and Times</h4>
            {appointmentDates.map((date, index) => (
              <div key={index} className="row mb-3">
                <div className="col">
                  <label className="form-label">{getOrdinal(index + 1)} Appointment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label">{getOrdinal(index + 1)} Appointment Time (24-hour format)</label>
                  <input
                    type="time"
                    className="form-control"
                    value={appointmentTimes[index]}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}

            {action === "Discharge" && (
              <>
                <h4 className="mt-4">Enter 10th Appointment Details</h4>
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">10th Appointment Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={resetDate}
                      onChange={(e) => setResetDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">10th Appointment Time (24-hour format)</label>
                    <input
                      type="time"
                      className="form-control"
                      value={resetTime}
                      onChange={(e) => setResetTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label">Upload PDF</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{
                  backgroundColor: "#00308F",
                  borderColor: "#00308F", 
                  transition: "background-color 0.3s ease, transform 0.3s ease", 
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#72A0C1"} 
                onMouseLeave={(e) => e.target.style.backgroundColor = "#00308F"} 
              >
                Submit
              </button>
            </div>

          </form>
        </div>

        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{ background: "rgba(255,255,255,0.8)" }}>
            <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5 text-primary">Processing your file, please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormPage;
