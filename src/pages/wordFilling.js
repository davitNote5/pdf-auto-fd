import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function WordFilling() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

    useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/", { replace: true });
    }
  }, []);
 
  const handleDownload = async () => {
    setLoading(true); 
    try {
      // Step 1: Get the zip filename from the backend
      const filenameResponse = await axios.get("https://pdf-auto-bd-6yf5.onrender.com/get-zip-filename");
      const filename = filenameResponse.data.filename;
  
      if (!filename) {
        console.error("No filename found.");
        alert("Error: No filename found.");
        return;
      }
  
      // Step 2: Send the request to the backend to generate the documents
      const response = await axios.post("https://pdf-auto-bd-6yf5.onrender.com/generate-documents", {}, {
        responseType: 'blob',  // Important to handle binary data
      });
  
      // Step 3: Create a temporary link to trigger the download with the fetched filename
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);  // Use the dynamic filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);  // Clean up after the download
    } catch (error) {
      console.error("Error downloading documents:", error);
      alert("Error downloading the file. Please try again.");
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  return (
    <div className="bg-light" style={{ height: '100vh' }}>
    <Header backgroundColor="#A31D1D" />
    <div className="container py-5">
      <div className="card p-5 shadow-lg">
        <h1 className="text-center mb-4">Word Filling</h1>
          <div className="text-center">
            {loading ? (
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="btn btn-primary btn-lg mt-3"
                  style={{
                    backgroundColor: "#00308F",
                    borderColor: "#00308F",
                    transition: "background-color 0.3s ease, transform 0.3s ease",
                    fontSize: '1.25rem',
                    padding: '10px 20px',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#72A0C1"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#00308F"}
                >
                  Download Zip
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordFilling;
