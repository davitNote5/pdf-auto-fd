import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import Modal from "react-modal";  // Import React Modal
import Spinner from 'react-bootstrap/Spinner';  // Correct way to import Spinner
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css"

Modal.setAppElement('#root');  // Set the root element for accessibility

function DiseaseEngine() {
  const navigate = useNavigate();
  const [diseaseData, setDiseaseData] = useState([]);
  const [visibleDescription, setVisibleDescription] = useState({});
  const [visibleSymptoms, setVisibleSymptoms] = useState({});
  const [editableFields, setEditableFields] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [loading, setLoading] = useState({});
  const [originalDiseaseData, setOriginalDiseaseData] = useState([]);


  // Toggle edit mode for all fields on a page
  const toggleEditableFields = (index) => {
    setEditableFields((prevState) => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        editable: !prevState[index]?.editable,
      },
    }));
  };


  // Handle changes in editable fields (medication, description, symptoms)
  const handleChange = (index, field, value) => {
    setDiseaseData((prevData) => {
      const newData = [...prevData];
      newData[index][field] = value; // Update the field for the specific page
      return newData;
    });
  };


  const handleSubmit = () => {
    setIsModalOpen(true);  // Open the modal for confirmation
  };

  const handleConfirmSubmit = () => {
    setIsModalOpen(false);  // Close the modal
    // Navigate to the WordFilling page with the disease data
    navigate("/wordFilling", { state: { diseaseData: diseaseData } });
  };

  const handleCancelSubmit = () => {
    setIsModalOpen(false);  // Close the modal if canceled
  };


  
  // Toggle description visibility for a specific page
  const toggleDescriptionVisibility = (index) => {
    setVisibleDescription(prevState => ({
      ...prevState,
      [index]: !prevState[index]  // Toggle the visibility of the specific page
    }));
  };

  // Toggle symptoms visibility for a specific page
  const toggleSymptomsVisibility = (index) => {
    setVisibleSymptoms(prevState => ({
      ...prevState,
      [index]: !prevState[index]  // Toggle the visibility of the specific page
    }));
  };

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Handle save changes request
  const handleSaveChanges = async (index) => {
    const updatedData = diseaseData[index];

    try {
      // Send the updated data to the backend
      const session_id = localStorage.getItem("session_id");
      const response = await axios.post("https://pdf-auto-bd-6yf5.onrender.com/save-disease-data", {
        pageIndex: index,
        updatedData: updatedData,
        session_id
      });

      // Handle success
      console.log("Changes saved successfully!");
      setEditableFields((prevState) => ({
        ...prevState,
        [index]: {
          editable: false,  // Disable edit mode after saving
        },
      }));
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    }
  };
    useEffect(() => {
        const fetchDiseaseData = async () => {
            try {
                const session_id = localStorage.getItem("session_id");
                const response = await axios.get("https://pdf-auto-bd-6yf5.onrender.com/get-main-cont-response", {
                  params: { session_id }
                });
                const data = response.data.mainContResponse;  // Get the mainContResponse from the response
                const formattedData = Object.values(data);  // Convert the object to an array if needed
                setDiseaseData(formattedData);  // Store the formatted data into the state
                setOriginalDiseaseData(JSON.parse(JSON.stringify(formattedData)));  // deep clone
            } catch (error) {
                console.error("Error fetching disease data:", error);
                alert("Error fetching disease data. Please try again.");
            }
        };

        fetchDiseaseData();  // Call the function to fetch data on page load
    }, []);
  // Handle button click (e.g., "Skip Page")
  const handleButtonClick = async (actionType, diseaseInfo, index) => {
    setLoading((prevLoading) => ({ ...prevLoading, [index]: true })); 

    try {
      // if (actionType === "runSameDiseaseGpt") {
      //   const original = originalDiseaseData[index];
      //   const current = diseaseData[index];

      //   console.log(`\u{1F50D} Comparison for Page ${index + 1}`);
      //   console.log("Before Save - Disease Name:", original?.diseaseName);
      //   console.log("After Save  - Disease Name:", current?.diseaseName);
      //   console.log("Before Save - Medication:", original?.med);
      //   console.log("After Save  - Medication:", current?.med);

      //   return; // skip backend call
      // }

      const session_id = localStorage.getItem("session_id");
      let apiUrl;
      const data = {
        disease_info: diseaseInfo,
        index: index, 
        session_id
      };

      // Set API endpoint based on the action type
      switch (actionType) {
        case "skipPage":
          apiUrl = "https://pdf-auto-bd-6yf5.onrender.com/skip-page";
          break;
        case "runDiffDisease":
        apiUrl = "https://pdf-auto-bd-6yf5.onrender.com/run-different-disease";
        break;
        // case "runSameDiseaseGpt":
        // apiUrl = "https://pdf-auto-bd-6yf5.onrender.com/run-same-disease-gpt";
        // break;
        case "runSameDiseaseGpt":
          const original = originalDiseaseData[index];
          const current = diseaseData[index];
        
          console.log(`🔍 Comparison for Page ${index + 1}`);
          console.log("Before Save - Disease Name:", original?.diseaseName);
          console.log("After Save  - Disease Name:", current?.diseaseName);
          console.log("Before Save - Medication:", original?.med);
          console.log("After Save  - Medication:", current?.med);
        
          apiUrl = "https://pdf-auto-bd-6yf5.onrender.com/run-same-disease-gpt";
          data.original_info = {
            diseaseName: original?.diseaseName,
            med: original?.med,
          };
          data.updated_info = {
            diseaseName: current?.diseaseName,
            med: current?.med,
          };
          break;
        case "runDiffDiseaseGPT":
        apiUrl = "https://pdf-auto-bd-6yf5.onrender.com/run-different-disease-gpt";
        break;
        case "runGptwithMedication":
        apiUrl = "https://pdf-auto-bd-6yf5.onrender.com/run-gpt-with-med";
        break;
        case "runGptWithoutMedication":
        apiUrl = "https://pdf-auto-bd-6yf5.onrender.com/run-gpt-without-med";
        break;
        default:
          return;


      }

      const response = await axios.post(apiUrl, data);
      const updatedData = response.data.updated_data;

      // setDiseaseData((prev) =>
      //   prev.map((disease) =>
      //     disease.text1 === diseaseInfo.text1 ? { ...disease, ...updatedData } : disease
      //   )
      // );
      setDiseaseData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...updatedData };
        return updated;
      });
    } catch (error) {
      console.error("Error processing the action:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const renderButtons = (showButton, diseaseInfo, index) => {
    const commonStyle = {
      transition: "background-color 0.3s ease, transform 0.3s ease"
    };
    const buttonClasses = {
      runDifferentDisease: "common-btn btn btn-primary btn-sm me-2",
      runSameDisease: "common-btn btn btn-success btn-sm me-2",
      runDifferentGPT: "common-btn btn btn-secondary btn-sm me-2",
      skipPage: "common-btn btn btn-danger btn-sm",
      runGptWithMed: "common-btn btn btn-warning text-white bg-dark btn-sm me-2",
      runGptWithoutrMed: "common-btn btn btn-info text-light btn-sm me-2",
    };
    if (loading[index]) {
      return <div className="text-center"><Spinner animation="grow" size="sm" role="status" variant="danger" /><p>Loading...</p></div>;
    }    
    return (
      <div>
        <div className="d-flex flex-wrap mb-2">
          <button className={buttonClasses.runDifferentDisease} style={commonStyle} onClick={() => handleButtonClick("runDiffDisease", diseaseInfo, index)}>Run Diff Disease</button>
          <button className={buttonClasses.runDifferentGPT} style={commonStyle} onClick={() => handleButtonClick("runDiffDiseaseGPT", diseaseInfo, index)}>Run Diff Disease (with GPT)</button>
          <button className={buttonClasses.runSameDisease} style={commonStyle} onClick={() => handleButtonClick("runSameDiseaseGpt", diseaseInfo, index)}>Run Custom Disease</button>
        </div>
        <div className="d-flex flex-wrap">
          <button className={buttonClasses.runGptWithMed} style={commonStyle} onClick={() => handleButtonClick("runGptwithMedication", diseaseInfo, index)}>Run GPT for med</button>
          <button className={buttonClasses.runGptWithoutrMed} style={commonStyle} onClick={() => handleButtonClick("runGptWithoutMedication", diseaseInfo, index)}>Get Disease Info without Med</button>
          <button className={buttonClasses.skipPage} style={commonStyle} onClick={() => handleButtonClick("skipPage", diseaseInfo, index)}>Skip Page</button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-light" style={{ height: '100vh' }}>
      <Header backgroundColor="#328E6E" />
      <div className="container py-5">
        <div className="card p-5 shadow-lg">
          <h1 className="text-center mb-4">Disease Engine Results</h1>
          <h3 className="mb-4">List of Diseases and Medications</h3>

          {diseaseData.map((disease, index) => (
            <div key={index} className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="text-primary">Page {index + 1}</h5>
                <div>{renderButtons(disease.showButton, disease, index)}</div>
              </div>

              <div className="mb-3">
                <strong>Disease:</strong>
                {editableFields[index]?.editable ? (
                  <input type="text" className="form-control" value={disease.diseaseName} onChange={(e) => handleChange(index, "diseaseName", e.target.value)} />
                ) : (
                  <p className="text-success">{disease.diseaseName}</p>
                )}
              </div>

              <div className="mb-3">
                <strong>Medication:</strong>
                {editableFields[index]?.editable ? (
                  <input type="text" className="form-control" value={disease.med} onChange={(e) => handleChange(index, "med", e.target.value)} />
                ) : (
                  <p className="text-success">{disease.med}</p>
                )}
              </div>

              <p className="text-info cursor-pointer" onClick={() => toggleDescriptionVisibility(index)}>
                {visibleDescription[index] ? "Hide Description" : "Show Description"}
              </p>
              {visibleDescription[index] && (
                <div className="mb-3">
                  <strong>Description:</strong>
                  {editableFields[index]?.editable ? (
                    <textarea className="form-control" value={disease.text1} onChange={(e) => handleChange(index, "text1", e.target.value)} />
                  ) : (
                    <p>{disease.text1}</p>
                  )}
                </div>
              )}

              <p className="text-info cursor-pointer" onClick={() => toggleSymptomsVisibility(index)}>
                {visibleSymptoms[index] ? "Hide Symptoms" : "Show Symptoms"}
              </p>
              {visibleSymptoms[index] && (
                <div className="mb-3">
                  <strong>Symptoms:</strong>
                  {editableFields[index]?.editable ? (
                    <textarea className="form-control" value={disease.text2} onChange={(e) => handleChange(index, "text2", e.target.value)} />
                  ) : (
                    <p>{disease.text2}</p>
                  )}
                </div>
              )}

              <button className={`btn ${editableFields[index]?.editable ? 'btn-success' : 'btn-outline-primary'} btn-lg me-3`} style={{ borderRadius: "30px", padding: "8px 20px", fontWeight: "500", fontSize: "1rem", transition: "all 0.3s ease-in-out" }} onClick={() => editableFields[index]?.editable ? handleSaveChanges(index) : toggleEditableFields(index)}>
                {editableFields[index]?.editable ? "Save Changes" : "Edit"}
              </button>
            </div>
          ))}

          <div className="text-center mt-4">
            <button className="btn btn-primary btn-lg" onClick={handleSubmit}>Submit</button>
          </div>

          <Modal isOpen={isModalOpen} onRequestClose={handleCancelSubmit} style={{ content: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "250px", maxHeight: "200px", padding: "30px", borderRadius: "15px", backgroundColor: "#f8f9fa", border: "1px solid #ddd", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" } }}>
            <h4 style={{ textAlign: "center", fontWeight: "500", color: "#495057" }}>Are you sure you want to continue?</h4>
            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-danger me-3" onClick={handleCancelSubmit}>No</button>
              <button className="btn btn-success" onClick={handleConfirmSubmit}>Yes</button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default DiseaseEngine;
